import { Request, Response } from "express";
import { IRequest } from "../interfaces/common.js";
import db from "../configs/database.js";

export const fetchLoggedInUser = async (req: IRequest, res: Response) => {
  try {
    if (req.user) {
      res.status(200).json(req.user);
    } else {
      throw new Error("your not authorized");
    }
  } catch (err) {
    res.sendStatus(500).json({ error: err });
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
        friends: true,
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
