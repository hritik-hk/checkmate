import { Response } from "express";
import { IRequest } from "../interfaces/common.js";
import { emitSocketEvent } from "../index.js";
import { GameEvent } from "../constants.js";
import db from "../configs/database.js";
import { randomGame } from "../game/randomGameManager.js";
import { GameStatus, GameType } from "@prisma/client";
import { gamesHandler } from "../index.js";

export const createNewGame = async (req: IRequest, res: Response) => {
  try {
    console.log(req.body);
    const recipientId = req.body.recipientId;
    const gameType: GameType = req.body.gameType;
    const gameDuration = req.body.gameDuration;

    // Check if it's a valid receiver
    const receiver = await db.user.findUnique({
      where: { id: recipientId },
    });

    if (!receiver) {
      throw new Error("user does not exist");
    }

    if (!req.user) {
      throw new Error("your not authorized");
    }

    // check if receiver is not the user who is requesting a game
    if (receiver.id === req.user.id) {
      throw new Error("You cannot play with yourself");
    }

    const newGame = await db.game.create({
      data: {
        whitePlayerId: req.user.id, // assigning white to the game creater for now
        blackPlayerId: receiver.id, // assigning black to game reciever
        status: GameStatus.IN_PROGRESS,
        gameType: gameType,
        gameDuration: gameDuration,
      },
    });

    //add to active games
    gamesHandler.addGame(newGame);

    // logic to emit start_game socket event to both players
    emitSocketEvent(newGame.blackPlayerId, GameEvent.INIT_GAME, newGame.id);

    emitSocketEvent(newGame.whitePlayerId, GameEvent.INIT_GAME, newGame.id);

    return res.status(201).json(newGame);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

export const handleRandomGame = async (req: IRequest, res: Response) => {
  try {
    if (req.user) {
      await randomGame.addPlayer(req, req.user);
      res.status(200).json({ msg: "request successful" });
    } else {
      throw new Error("your not authorized!");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

export const getGamesHistory = async (req: IRequest, res: Response) => {
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

    if (user === null) return res.status(400).json({ msg: "invalid username" });

    //fetch games
    const games = await db.game.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                blackPlayerId: user.id,
              },
              {
                whitePlayerId: user.id,
              },
            ],
          },
          {
            isGameOver: true,
          },
        ],
      },
      select: {
        gameType: true,
        blackPlayer: true,
        whitePlayer: true,
        winnerId: true,
        createdAt: true,
      },
    });

    //fetch tournament games
    const tournamentGames = await db.tournamentGame.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                blackPlayerId: user.id,
              },
              {
                whitePlayerId: user.id,
              },
            ],
          },
          {
            isGameOver: true,
          },
        ],
      },
      select: {
        gameType: true,
        blackPlayer: true,
        whitePlayer: true,
        winnerId: true,
        createdAt: true,
      },
    });

    const gamesHistory = [...games, ...tournamentGames];

    return res.status(200).json(gamesHistory);
  } catch (err) {
    console.log("error at games history controller: ", err);
    return res.status(500).json({ error: err });
  }
};
