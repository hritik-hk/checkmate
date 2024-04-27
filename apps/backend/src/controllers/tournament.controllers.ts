import db from "../configs/database.js";
import { IGame, IRequest } from "../interfaces/common.js";
import { Response } from "express";
import { tournament } from "../game/tournamentManager.js";

export const createTournament = async (req: IRequest, res: Response) => {
  try {
    const participants: string[] = req.body?.participants || [];

    if (participants.length < 3) {
      return res
        .status(400)
        .json({ error: "Pls select atleast 3 participants for Tournament" });
    }

    const newTournament = await db.tournament.create({
      data: {
        participants: participants,
      },
    });

    //create all tournament games - round robin format

    let gamesList: IGame[]= [];

    for (let i = 0; i < participants.length; i++) {
      //create points table
      await db.points.create({
        data: {
          tournamentId: newTournament.id,
          userId: participants[i] as string,
          point: 0,
        },
      });

      for (let j = i + 1; j < participants.length; j++) {
        //create game
        const game = await db.game.create({
          data: {
            whitePlayerId: participants[i] as string,
            blackPlayerId: participants[j] as string,
            status: "IN_PROGRESS",
            tournamentId: newTournament.id,
          },
        });

        gamesList.push(game);
      }
    }

    tournament.addGamesInTournament(newTournament.id, gamesList)

    return res.status(200).json(newTournament);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

