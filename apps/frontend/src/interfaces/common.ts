import { Dispatch, ReactNode } from "react";
import { Socket } from "socket.io-client";
import { Chess } from "chess.js";
import { Square } from "react-chessboard/dist/chessboard/types";

export interface authUserType {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
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
  sendMoveUpdate: (update: string) => void;
  gameState: Chess;
  setGameState: React.Dispatch<React.SetStateAction<Chess>>;
  socket: Socket | null;
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
