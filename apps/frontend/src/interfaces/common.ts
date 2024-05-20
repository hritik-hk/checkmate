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

export interface ITournamentGame {
  id: string;
  whitePlayerId: string;
  blackPlayerId: string;
  tournamentId: string;
  status: "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
  gameType: "RAPID" | "BLITZ";
  gameDuration: number;
  winnerId: string | null;
  isDraw: boolean;
  moves: string[];
  roundId: string;
}

export interface roundInterface {
  id: string;
  tournamentId: string;
  roundNumber: number;
  startTime: string;
  endTime: string;
  bye?: string;
  roundGames: ITournamentGame[];
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
  point: number;
  gamesPlayed: number;
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
  ongoingTournament: string | null;
  setOngoingTournament: Dispatch<React.SetStateAction<string | null>>;
}

export interface user {
  id: string;
  username: string;
  email: string;
  blitz_rating: number;
  rapid_rating: number;
  createdAt: number;
  friends: any;
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
