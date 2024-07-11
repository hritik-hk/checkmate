import { Request, Response } from "express";
import { IRequest } from "../interfaces/common.js";
import db from "../configs/database.js";
import { Status } from "@prisma/client";

export const fetchLoggedInUser = async (req: IRequest, res: Response) => {
  try {
    if (req.user) {
      return res.status(200).json(req.user);
    } else {
      throw new Error("your not authorized");
    }
  } catch (err) {
    return res.sendStatus(500).json({ error: err });
  }
};

export const fetchUserByUsername = async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const user = await db.user.findUnique({
      where: { username: username },
      select: {
        id: true,
        email: true,
        username: true,
        blitz_rating: true,
        rapid_rating: true,
        createdAt: true,
        friends: {
          select: {
            id: true,
            email: true,
            username: true,
            blitz_rating: true,
            rapid_rating: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err });
  }
};

export const createFriendRequest = async (req: IRequest, res: Response) => {
  try {
    const { senderUsername, senderId, receiverUsername, receiverId } = req.body;

    const request = await db.friendRequest.create({
      data: {
        senderUsername: senderUsername,
        senderId: senderId,
        receiverUsername: receiverUsername,
        receiverId: receiverId,
      },
    });

    return res.status(201).json(request);
  } catch (err) {
    console.log("error while create friend req: ", err);
    res.status(500).json({ error: err });
  }
};

export const declineFriendRequest = async (req: IRequest, res: Response) => {
  try {
    const { senderId, receiverId } = req.body;

    const request = await db.friendRequest.delete({
      where: {
        senderId_receiverId: {
          senderId: senderId,
          receiverId: receiverId,
        },
      },
    });

    return res.status(200).json(request);
  } catch (err) {
    console.log("error declining friend reqquest: ", err);
    res.status(500).json({ error: err });
  }
};

export const addFriendship = async (req: IRequest, res: Response) => {
  try {
    const { senderId, receiverId } = req.body;

    // create friend relationship in both directions
    await db.user.update({
      where: { id: senderId },
      data: {
        friends: {
          connect: { id: receiverId },
        },
      },
    });

    await db.user.update({
      where: { id: receiverId },
      data: {
        friends: {
          connect: { id: senderId },
        },
      },
    });

    //delete friendRequest from freindRequest table
    await db.friendRequest.delete({
      where: {
        senderId_receiverId: {
          senderId: senderId,
          receiverId: receiverId,
        },
      },
    });

    return res
      .status(200)
      .json({ msg: "friend request accepted, friendship added" });
  } catch (err) {
    console.log("error accepting friend reqquest: ", err);
    return res.status(500).json({ error: err });
  }
};

export const getRecievedFriendRequests = async (
  req: IRequest,
  res: Response
) => {
  try {
    const user = req.user;

    const requests = await db.friendRequest.findMany({
      where: {
        receiverId: user?.id,
      },
    });

    return res.status(200).json(requests);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};

export const getSentFriendRequests = async (req: IRequest, res: Response) => {
  try {
    const user = req.user;

    const requests = await db.friendRequest.findMany({
      where: {
        senderId: user?.id,
      },
    });

    return res.status(200).json(requests);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
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
                whitePlayerId: user.id,
              },
              {
                blackPlayerId: user.id,
              },
            ],
          },
          {
            status: Status.COMPLETED,
          },
        ],
      },
      select: {
        gameType: true,
        blackPlayer: {
          select: {
            id: true,
            username: true,
          },
        },
        whitePlayer: {
          select: {
            id: true,
            username: true,
          },
        },
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
            status: Status.COMPLETED,
          },
        ],
      },
      select: {
        gameType: true,
        blackPlayer: {
          select: {
            id: true,
            username: true,
          },
        },
        whitePlayer: {
          select: {
            id: true,
            username: true,
          },
        },
        winnerId: true,
        createdAt: true,
      },
    });

    let gamesHistory = [...games, ...tournamentGames];

    return res.status(200).json(gamesHistory);
  } catch (err) {
    console.log("error at games history controller: ", err);
    return res.status(500).json({ error: err });
  }
};

export const getOnGoingGame = async (req: IRequest, res: Response) => {
  try {
    const userId = req.body.userId;

    const game = await db.game.findFirst({
      where: {
        OR: [
          {
            whitePlayerId: userId,
            status: Status.IN_PROGRESS,
          },
          {
            blackPlayerId: userId,
            status: Status.IN_PROGRESS,
          },
        ],
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

    return res.status(200).json({ gameInfo: game });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};

export const getTournamentHistory = async (req: IRequest, res: Response) => {
  try {
    const userId = req.body.userId;

    const tournamentHistory = await db.tournamentParticipant.findMany({
      where: {
        userId: userId,
        tournament: {
          status: Status.COMPLETED,
        },
      },
      orderBy: {
        tournament: {
          createdAt: "desc",
        },
      },
      select: {
        tournament: {
          select: {
            name: true,
            gameType: true,
            createdAt: true,
            participants: {
              select: {
                user: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return res.status(200).json(tournamentHistory);
  } catch (err) {
    console.log("error at getTournamentHistory controller: ", err);
    return res.status(500).json({ error: err });
  }
};

export const getOngoingTournament = async (req: IRequest, res: Response) => {
  try {
    const userId = req.body.userId;

    const tournament = await db.tournamentParticipant.findMany({
      where: {
        userId: userId,
        tournament: {
          status: Status.IN_PROGRESS,
        },
      },
      select: {
        tournament: {
          select: {
            id: true,
            name: true,
            status: true,
            gameType: true,
          },
        },
      },
    });

    return res.status(200).json(tournament);
  } catch (err) {
    console.log("error fetching on-going tournament", err);
    return res.status(500).json(err);
  }
};
