import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import {
  genPassword,
  issueJWT,
  validPassword,
} from "../utils/helpers.utils.js";
import { IRequest } from "../interfaces/common.js";
import cookie from "cookie";

const prisma = new PrismaClient();

//register
const createUser = async (req: IRequest, res: Response) => {
  try {
    const { hash, salt } = genPassword(req.body.password);

    const user = await prisma.user.create({
      data: {
        email: req.body.email,
        username: req.body.username,
        password_salt: salt,
        password_hash: hash,
      },
    });
    res.status(201).json({ msg: "user created" });
  } catch (err) {
    res.status(500).json(err);
  }
};

const loginUser = async (req: IRequest, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { username: username },
    });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, msg: "invalid credentials" });
    }

    const isValid = validPassword(
      password,
      user.password_hash,
      user.password_salt
    );

    if (isValid) {
      const { token, expires } = issueJWT({
        id: user.id,
        username: user.username,
        email: user.email,
      }); //issue token

      const cookieOptions = {
        httpOnly: true,
        maxAge: expires,
      };

      res
        .status(200)
        .cookie("accessToken", token, cookieOptions)
        .json({ success: true, token: token });
    } else {
      res.status(401).json({ msg: "invalid credentials" });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500).json({ error: err });
  }
};

const checkAuth = async (req: IRequest, res: Response) => {
  try {
    if (req?.user && req.headers.cookie) {
      const cookies = cookie.parse(req.headers.cookie || "");
      const token = cookies?.accessToken || "";
      res.status(200).json({ token });
    } else {
      res.status(401).json({ token: "" });
    }
  } catch (err) {
    console.log("checkAuth", err);
  }
};

export { createUser, loginUser, checkAuth };
