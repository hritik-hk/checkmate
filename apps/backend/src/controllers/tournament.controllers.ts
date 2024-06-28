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

    const newTournament = await db.tournament.create({
      data: {
        participants: playerIds,
        status: Status.IN_PROGRESS,
      },
    });

    //create all tournament games - round robin format
    const tournamentData = createSingleRoundRobin(
      playerIds,
      newTournament.id,
      gameType,
      gameDuration
    );

    const rounds = await db.round.createMany({
      data: tournamentData.rounds,
    });

    const tournamentGames = await db.tournamentGame.createMany({
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

    //Todo: add gameType in tournament schema itself
    const data = await db.tournament.findFirst({
      where: {
        id: tournamentId,
      },
      select: {
        participants: true,
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

    if (!data) return res.status(400).json({ msg: "invalid tournament" });

    for (let i = 0; i < data.participants.length; i++) {
      const player = data.participants[i] as string;
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
                  status: Status.COMPLETED,
                },
              ],
            },
          ],
        },
        select: {
          id: true,
          result: true,
          gameType: true,
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
          games[0]?.gameType === GameType.BLITZ
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

export const getTournamentHistory = async (req: IRequest, res: Response) => {
  try {
    const username = req.body.username;

    //fetch user
    const user = await db.user.findFirst({
      where: {
        username: username,
      },
      select: {
        id: true,
      },
    });

    if (user === null) return res.status(400).json({ msg: "invalid user" });

    const tournamentHistory = await db.tournament.findMany({
      where: {
        participants: {
          has: user.id,
        },
      },
    });

    return res.status(200).json(tournamentHistory);
  } catch (err) {
    console.log("error at getTournamentHistory controller: ", err);
    return res.status(500).json({ error: err });
  }
};
