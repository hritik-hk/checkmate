import { Socket } from "socket.io";
import { Request } from "express";

export interface IUser {
  id: string;
  email: string;
  username: string;
  blitz_rating: Number;
  rapid_rating: Number;
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

export interface IRound {
  id: string;
  roundNumber: number;
  tournamentId: string;
  bye?: string;
  startTime: any;
  endTime: any;
}
