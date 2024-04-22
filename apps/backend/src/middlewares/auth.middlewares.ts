import jwt from "jsonwebtoken";
import cookie from "cookie";
import { PrismaClient } from "@prisma/client";
import { Response, NextFunction } from "express";
import { IRequest } from "../interfaces/common.js";
import { payload } from "../interfaces/common.js";

const prisma = new PrismaClient();

export default async function isAuth(
  req: IRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const cookies = cookie.parse(req.headers?.cookie || "");
    const token = cookies?.accessToken;
    if (token) {
      const jwt_secret = process.env.ACCESS_TOKEN_SECRET as string;
      const userPayload = jwt.verify(token, jwt_secret) as payload;

      const user = await prisma.user.findUnique({
        where: { id: userPayload.userId },
        select: {
          id: true,
          email: true,
          username: true,
          rating: true
        },
      });

      if (!user) {
        return res.status(401);
      }
      req.user = user;
    } else {
      return res.sendStatus(401);
    }
  } catch (err) {
    console.log("Authentication error", err);
    next(err);
  }

  next();
}
