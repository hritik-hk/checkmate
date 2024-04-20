import { createContext, useCallback, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { Chess } from "chess.js";
import { move } from "../interfaces/common";

import {
  SocketContextInterface,
  SocketProviderProps,
} from "../interfaces/common";

export const SocketContext = createContext<SocketContextInterface | null>(null);

export const SocketContextProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<Chess>(new Chess());

  useEffect(() => {
    console.log(gameState.fen());
  }, [gameState]);

  //const [moveHistory, setMoveHistory] = useState<string[][]>([]);

  const sendMoveUpdate: SocketContextInterface["sendMoveUpdate"] = useCallback(
    (movePlayed: move) => {
      console.log("move played: ", movePlayed);

      if (socket) {
        const activeGame = localStorage.getItem("activeGame");
        if (activeGame) {
          const activeGameData = JSON.parse(activeGame);
          const update = JSON.stringify(movePlayed);
          socket.emit("move-update", activeGameData.gameId, update);
        }
      }
    },
    [socket]
  );

  const onUpdateReceive = useCallback(
    (update: string) => {
      //const move: moveType = JSON.parse(update);
      console.log("onUpdateReceive", update);

      try {
        //const gameCopy = _.cloneDeep(gameState);
        // console.log("gameCopy fen", gameCopy.fen());
        // const result = gameCopy.move(move);

        //console.log(result);

        setGameState(new Chess(update));

        //return result; // null if the move was illegal, the move object if the move was legal
      } catch (error) {
        console.log("error while updating move from server", error);
      }
    },
    [gameState]
  );

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URI, {
      withCredentials: true,
    });
    setSocket(socket);

    socket.on("move-update", onUpdateReceive);

    socket.on(
      "new-game",
      (gameId: string, whitePlayerId: string, blackPlayerId: string) => {
        socket.emit("new-game", gameId);
        localStorage.setItem(
          "activeGame",
          JSON.stringify({ gameId, whitePlayerId, blackPlayerId })
        );
      }
    );

    return () => {
      socket.disconnect();
      socket.off("move-update", onUpdateReceive);
      setSocket(null);
    };
  }, []);

  useEffect(() => {
    const gameId = localStorage.getItem("gameId");

    if (gameId) {
      if (socket) {
        socket.emit("new-game", gameId);
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
