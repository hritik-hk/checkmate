import { Request, Response } from "express";
import { IRequest } from "../interfaces/common.js";
import db from "../configs/database.js";

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

    res.status(200).json(user);
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

export const getRecievedFriendRequests = async (req: IRequest, res: Response) => {
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
