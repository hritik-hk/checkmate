import db from "../configs/database.js";
import { IRequest } from "../interfaces/common.js";
import { Response } from "express";
import { createSingleRoundRobin } from "../utils/helpers.utils.js";
import { tournamentHandler } from "../index.js";
import { GameResult, GameType, Status } from "@prisma/client";
import { emitSocketEvent } from "../index.js";
import { TournamentEvent } from "../constants.js";

export const createTournament = async (req: IRequest, res: Response) => {
  try {
    const participants: string[] = req.body?.participants || [];
    const gameType = req.body?.gameType;
    const gameDuration = req.body.gameDuration;

    if (participants.length < 3) {
      return res
        .status(400)
        .json({ error: "Pls select atleast 3 participants for Tournament" });
    }

    //check if all the participants exist in db
    const users = await db.user.findMany({
      where: {
        username: {
          in: participants,
        },
      },
      select: {
        id: true,
      },
    });

    if (users.length !== participants.length) {
      return res.status(400).json({ error: "some users are invalid" });
    }

    const playerIds = users.map((player) => player.id);
    const totalTournaments = await db.tournament.count();
    const currTournamentNum = totalTournaments + 1;

    const newTournament = await db.tournament.create({
      data: {
        name: "Checkmate Clash #" + currTournamentNum.toString(),
        gameType: gameType,
        status: Status.IN_PROGRESS,
      },
    });

    const tournamentParticipant = playerIds.map((player) => ({
      userId: player,
      tournamentId: newTournament.id,
    }));

    //create tournament participants
    await db.tournamentParticipant.createMany({
      data: tournamentParticipant,
    });

    //create all tournament games - round robin format
    const tournamentData = createSingleRoundRobin(
      playerIds,
      newTournament.id,
      gameType,
      gameDuration
    );

    await db.round.createMany({
      data: tournamentData.rounds,
    });

    await db.tournamentGame.createMany({
      data: tournamentData.tournamentGames,
    });

    //add to active tournaments
    await tournamentHandler.addTournament(newTournament.id);

    //To Do: emit tournament init event to all participants
    for (let i = 0; i < playerIds.length; i++) {
      const playerId = playerIds[i];
      if (playerId) {
        emitSocketEvent(
          playerId,
          TournamentEvent.INIT_TOURNAMENT,
          newTournament.id
        );
      }
    }

    return res.status(200).json({ id: newTournament.id });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

export const getPointsTable = async (req: IRequest, res: Response) => {
  try {
    const tournamentId = req.body.tournamentId;

    const tournament = await db.tournament.findFirst({
      where: {
        id: tournamentId,
      },
      select: {
        participants: {
          select: {
            userId: true,
          },
        },
        gameType: true,
      },
    });

    let pointsTable: {
      player_id: string;
      player_username: string;
      gamesPlayed: number;
      point: number;
      rating: number;
      position: number;
    }[] = [];

    if (!tournament) return res.status(400).json({ msg: "invalid tournament" });

    for (let i = 0; i < tournament.participants.length; i++) {
      const player = tournament.participants[i]?.userId as string;
      const games = await db.tournamentGame.findMany({
        where: {
          OR: [
            {
              tournamentId: tournamentId,
              winnerId: player,
              status: Status.COMPLETED,
            },
            {
              AND: [
                {
                  OR: [
                    {
                      blackPlayerId: player,
                    },
                    {
                      whitePlayerId: player,
                    },
                  ],
                },
                {
                  tournamentId: tournamentId,
                  result: GameResult.DRAW,
                  status: Status.COMPLETED,
                },
              ],
            },
          ],
        },
        select: {
          id: true,
          result: true,
        },
      });

      const user = await db.user.findFirst({
        where: {
          id: player,
        },
        select: {
          username: true,
          rapid_rating: true,
          blitz_rating: true,
        },
      });

      if (!user)
        return res.status(400).json({ msg: "invalid user in tournament" });

      //calulate point
      let point = 0;
      for (let i = 0; i < games.length; i++) {
        if (games[i]?.result === GameResult.DRAW) {
          point += 0.5;
        } else point++;
      }

      pointsTable.push({
        player_id: player,
        player_username: user?.username as string,
        gamesPlayed: games.length,
        point: point,
        rating:
          tournament.gameType === GameType.BLITZ
            ? (user?.blitz_rating as number)
            : (user?.rapid_rating as number),
        position: 1,
      });
    }

    pointsTable.sort((a, b) => {
      if (a.point === b.point) {
        // when points are equal, compare by rating
        return b.rating - a.rating;
      } else {
        // otherwise, compare by points
        return b.point - a.point;
      }
    });

    return res.status(200).json(pointsTable);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

export const getFixture = async (req: IRequest, res: Response) => {
  try {
    const tournamentId = req.body.tournamentId;

    const rounds = await db.round.findMany({
      where: { tournamentId: tournamentId },
      orderBy: {
        roundNumber: "asc",
      },
      select: {
        id: true,
        roundNumber: true,
        bye: true,
      },
    });

    let fixture: any = [];

    for (let i = 0; i < rounds.length; i++) {
      const round = rounds[i];
      if (!round) return res.status(400).json({ msg: "invalid tournament" });

      const games = await db.tournamentGame.findMany({
        where: {
          roundId: round.id,
        },
        select: {
          whitePlayer: true,
          blackPlayer: true,
        },
      });

      let roundGames = [];

      games.forEach((game) => {
        roundGames.push({
          player1_username: game.whitePlayer.username,
          player1_id: game.whitePlayer.id,
          player2_username: game.blackPlayer.username,
          player2_id: game.blackPlayer.id,
        });
      });

      if (round.bye) {
        const byePlayer = await db.user.findFirst({
          where: {
            id: round.bye,
          },
          select: {
            id: true,
            username: true,
          },
        });

        roundGames.push({
          player1_username: byePlayer?.username,
          player1_id: byePlayer?.id,
          player2_username: "BYE",
          player2_id: "BYE",
        });
      }

      fixture.push({
        round: round.roundNumber,
        games: roundGames,
      });
    }

    return res.status(200).json(fixture);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};

export const getOngoingTournamentGames = async (
  req: IRequest,
  res: Response
) => {
  try {
    const tournamentId = req.body.tournamentId;
    const roundId = req.body.roundId;

    const tournamentGames = await db.tournamentGame.findMany({
      where: {
        tournamentId: tournamentId,
        roundId: roundId,
        status: Status.IN_PROGRESS,
      },
      select: {
        id: true,
        status: true,
        whitePlayer: {
          select: {
            username: true,
          },
        },
        blackPlayer: {
          select: {
            username: true,
          },
        },
        gameType: true,
      },
    });

    return res.status(200).json(tournamentGames);
  } catch (err) {
    console.log(
      `error fetching on-going tournament: ${req.body.tournamentId} games`,
      err
    );
    return res.status(500).json(err);
  }
};
