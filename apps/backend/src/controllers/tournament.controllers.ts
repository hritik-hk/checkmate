import db from "../configs/database.js";
import { IRequest } from "../interfaces/common.js";
import { Response } from "express";
import { createSingleRoundRobin } from "../utils/helpers.utils.js";
import { tournamentHandler } from "../index.js";

export const createTournament = async (req: IRequest, res: Response) => {
  try {
    const participants: string[] = req.body?.participants || [];
    const name = req.body.name;
    const numOfRounds =
      participants.length % 2 === 0
        ? participants.length - 1
        : participants.length;

    const gameType = req.body?.gameType;
    const gameDuration = req.body.gameDuration;

    if (participants.length < 3) {
      return res
        .status(400)
        .json({ error: "Pls select atleast 3 participants for Tournament" });
    }

    const newTournament = await db.tournament.create({
      data: {
        name: name,
        participants: participants,
        totalRounds: numOfRounds,
      },
    });

    //create all tournament games - round robin format
    const tournamentData = createSingleRoundRobin(
      participants,
      newTournament.id,
      gameType,
      gameDuration
    );

    const tournamentGames = await db.tournamentGame.createMany({
      data: tournamentData.tournamentGames,
    });

    const rounds = await db.round.createMany({
      data: tournamentData.rounds,
    });

    //add to active tournaments
    tournamentHandler.addTournament(newTournament, tournamentGames, rounds);

    //To Do: emit socket event tournament start to all participants

    return res.status(200).json({ newTournament, tournamentGames, rounds });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
