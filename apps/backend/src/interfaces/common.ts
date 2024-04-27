import { Socket } from "socket.io";
import { Request } from "express";

export interface IUser {
  id: string;
  username: string;
  email: string;
  rating: number;
}

export interface ISocket extends Socket {
  user?: IUser;
}

export interface IRequest extends Request {
  user?: IUser;
}

export interface hashPasswordType {
  salt: string;
  hash: string;
}

export interface jwtResponse {
  token: string;
  expires: number;
}

export interface payload {
  userId: string;
}

export interface IGame {
  id: string;
  whitePlayerId: string;
  blackPlayerId: string;
  tournamentId: string | null;
  status: "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
  winnerId: string | null;
  isDraw: boolean;
  moves: string[];
}
