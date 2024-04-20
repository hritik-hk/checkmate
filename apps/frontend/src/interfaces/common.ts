import { Dispatch, ReactNode } from "react";
import { Socket } from "socket.io-client";
import { Chess } from "chess.js";
import { Square } from "chess.js";

export interface authUserType {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
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
  sendMoveUpdate: (movePlayed: move) => void;
  gameState: Chess;
  setGameState: React.Dispatch<React.SetStateAction<Chess>>;
  socket: Socket | null;
}

export interface user {
  id: string;
  username: string;
  email: string;
}

export interface move {
  from: Square;
  to: Square;
  piece: string;
  promotion?: string;
}

export interface activeGame {
  gameId: string;
  whitePlayerId: string;
  blackPlayerId: string;
}
