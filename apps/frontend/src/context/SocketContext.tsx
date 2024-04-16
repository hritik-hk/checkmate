import { createContext, useCallback, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { Chess } from "chess.js";
import { makeAMove } from "../utils/helpers";

import {
  SocketContextInterface,
  SocketProviderProps,
} from "../interfaces/common";

export const SocketContext = createContext<SocketContextInterface | null>(null);

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<Chess>(new Chess());

  //const [moveHistory, setMoveHistory] = useState<string[][]>([]);

  const sendMoveUpdate: SocketContextInterface["sendMoveUpdate"] = useCallback(
    (move: string) => {
      console.log("move made", move);
      if (socket) {
        socket.emit("move", move);
      }
    },
    [socket]
  );

  const onUpdateReceive = useCallback(
    async (move: string) => {
      makeAMove(move, gameState, setGameState);
    },
    [gameState]
  );

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URI, {
      withCredentials: true,
    });
    setSocket(socket);

    socket.on("move-update", onUpdateReceive);

    // socket.on("new-game", (gameId: string) => {
    //   socket.emit("new-game", gameId);
    //   localStorage.setItem("gameId", gameId);
    // });

    return () => {
      socket.disconnect();
      socket.off("move-update", onUpdateReceive);
      setSocket(null);
    };
  }, [socket, onUpdateReceive]);

  useEffect(() => {
    const privateRoomId = localStorage.getItem("privateRoomId");

    if (privateRoomId) {
      if (socket) {
        socket.emit("private-chat", privateRoomId);
      }
    }
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{ sendMoveUpdate, gameState, setGameState, socket }}
    >
      {children}
    </SocketContext.Provider>
  );
};
