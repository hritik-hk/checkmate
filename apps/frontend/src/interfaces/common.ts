import { Dispatch, ReactNode } from "react";
import { Socket } from "socket.io-client";
import { Chess } from "chess.js";
import { Square } from "chess.js";
import { BoardOrientation } from "react-chessboard/dist/chessboard/types";

export interface authUserType {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface gameInfoInterface {
  gameId: string;
  boardStatus: string;
  whitePlayer: {
    id: string;
    blitz_rating: number;
    rapid_rating: number;
    username: string;
  };
  blackPlayer: {
    id: string;
    blitz_rating: number;
    rapid_rating: number;
    username: string;
  };
  timeUsedByWhitePlayer: number;
  timeUsedByBlackPlayer: number;
  gameDuration: number;
  gameType: string;
}

export interface roundInterface {
  id: string;
  tournamentId: string;
  roundNumber: number;
  startTime: number;
  endTime: number;
  roundGames: [];
}

export interface AuthContextInterface {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<React.SetStateAction<boolean>>;
  authUser: authUserType | null;
  setAuthUser: Dispatch<React.SetStateAction<authUserType | null>>;
}

export interface SocketProviderProps {
  children?: ReactNode;
}

export interface SocketContextInterface {
  socket: Socket | null;
}

export interface GameContextInterface {
  currGameInfo: gameInfoInterface | null;
  setCurrGameInfo: Dispatch<React.SetStateAction<gameInfoInterface | null>>;
  gameState: Chess | null;
  setGameState: React.Dispatch<React.SetStateAction<Chess | null>>;
  myCountDown: number | null;
  setMyCountDown: React.Dispatch<React.SetStateAction<number | null>>;
  opponentCountDown: number | null;
  setOpponentCountDown: React.Dispatch<React.SetStateAction<number | null>>;
}

export interface points {
  position: number;
  player_username: string;
  player_id: string;
  points: number;
  rating: number;
}

export interface fixtureRow {
  round: number;
  games: {
    player1_username: string;
    player1_id: string;
    player2_username: string;
    player2_id: string;
  }[];
}

export interface TournamentContextInterface {
  currRoundInfo: roundInterface | null;
  setCurrRoundInfo: Dispatch<React.SetStateAction<roundInterface | null>>;
  pointsTable: points[] | null;
  setPointsTable: React.Dispatch<React.SetStateAction<points[] | null>>;
  fixture: fixtureRow[] | null;
  setFixture: React.Dispatch<React.SetStateAction<fixtureRow[] | null>>;
}

export interface user {
  id: string;
  username: string;
  email: string;
}

export interface moveType {
  from: Square;
  to: Square;
  promotion?: string;
}

export interface boardProps {
  gameId: string;
  gameState: Chess;
  boardOrientation: BoardOrientation;
  myCountDown: number | null;
  opponentCountDown: number | null;
  setMyCountDown: React.Dispatch<React.SetStateAction<number | null>>;
  setOpponentCountDown: React.Dispatch<React.SetStateAction<number | null>>;
  whitePlayerId: string;
  opponentInfo: {
    id: string;
    blitz_rating: number;
    rapid_rating: number;
    username: string;
  };
  myInfo: {
    id: string;
    blitz_rating: number;
    rapid_rating: number;
    username: string;
  };
  gameType: string;
}
