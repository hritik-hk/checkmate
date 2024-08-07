import { Socket } from "socket.io";
import { Request } from "express";
import { GameResult, GameType, Status } from "@prisma/client";

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
  result: GameResult | null;
  status: Status;
  gameType: GameType;
  gameDuration: number;
  winnerId: string | null;
}

export interface ITournamentGame {
  id: string;
  whitePlayerId: string;
  blackPlayerId: string;
  tournamentId: string;
  result: GameResult | null;
  status: Status;
  gameType: GameType;
  gameDuration: number;
  winnerId: string | null;
  roundId: string;
}

export interface IRound {
  id: string;
  tournamentId: string;
  roundNumber: number;
  startTime: string;
  endTime: string;
  roundGames?: ITournamentGame[];
  bye?: string | null;
}

export interface ITournament {
  id: string;
  roundData: IRound[];
}
