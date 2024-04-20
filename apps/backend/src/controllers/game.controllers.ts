import { Response } from "express";
import { IRequest } from "../interfaces/common.js";
import { PrismaClient } from "@prisma/client";
import { emitSocketEvent } from "../socket/socket.js";
import { GameEvent } from "../constants.js";
import { GameState, activeGames } from "../game/game.js";

const prisma = new PrismaClient();

export const createNewGame = async (req: IRequest, res: Response) => {
  const { recipientId } = req.params;

  try {
    // Check if it's a valid receiver
    const receiver = await prisma.user.findUnique({
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

    const newGame = await prisma.game.create({
      data: {
        whitePlayerId: req.user.id, // assigning white to the game creater for now
        blackPlayerId: receiver.id, // assigning black to game reciever
      },
    });

    //create the new game
    const game = new GameState(newGame.whitePlayerId, newGame.blackPlayerId);

    //add to active games
    activeGames.set(newGame.id, game);

    // logic to emit socket event about the new game created
    emitSocketEvent(
      req,
      newGame.blackPlayerId,
      GameEvent.NEW_GAME_EVENT,
      newGame.id
    );

    return res
      .status(201)
      .json({ msg: "game created successfully", game: newGame });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};
