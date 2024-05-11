import { Chessboard } from "react-chessboard";
import { Square } from "react-chessboard/dist/chessboard/types";
import { boardProps } from "../interfaces/common";
import { useSocket } from "@/hooks/socket";
import { GameEvent } from "@/utils/constant";
import { moveType } from "../interfaces/common";
import CountDown from "./CountDown";
import { useRef, useEffect } from "react";

export default function Board({
  gameId,
  gameState,
  boardOrientation,
  myCountDown,
  opponentCountDown,
  setMyCountDown,
  setOpponentCountDown,
  opponentInfo,
  myInfo,
}: boardProps) {
  const { socket } = useSocket();

  const myMinLeft = Math.floor(myCountDown / 60);
  const mySecLeft = Math.floor(myCountDown % 60);

  const opponentMinLeft = Math.floor(opponentCountDown / 60);
  const opponentSecLeft = Math.floor(opponentCountDown % 60);

  const myTimerId = useRef<NodeJS.Timeout | null>(null); // useRef hook to store interval ID
  const opponentTimerId = useRef<NodeJS.Timeout | null>(null);

  const stopMyTimer = () => {
    if (myTimerId.current) {
      clearInterval(myTimerId.current);
      myTimerId.current = null;
    }
  };

  const stopOpponentTimer = () => {
    if (opponentTimerId.current) {
      clearInterval(opponentTimerId.current);
      opponentTimerId.current = null;
    }
  };

  // Todo: problem faced on closures, read about closure
  const startMyTimer = () => {
    if (!myTimerId.current) {
      myTimerId.current = setInterval(() => {
        setMyCountDown((prevSeconds) => {
          if (prevSeconds <= 1) {
            stopMyTimer();
            return 0;
          } else return prevSeconds - 1;
        });
      }, 1000); // Update every second
    }
  };

  const startOpponentTimer = () => {
    if (!opponentTimerId.current) {
      opponentTimerId.current = setInterval(() => {
        setOpponentCountDown((prevSeconds) => {
          if (prevSeconds <= 1) {
            stopOpponentTimer();
            return 0;
          } else return prevSeconds - 1;
        });
      }, 1000); // Update every second
    }
  };

  const handleReceivedUpdate = (move: moveType) => {
    gameState.move(move);
    stopOpponentTimer();
    startMyTimer();
  };

  useEffect(() => {
    if (socket === null) return;

    socket.on(GameEvent.MOVE_UPDATE_EVENT, handleReceivedUpdate);

    return () => {
      socket.off(GameEvent.MOVE_UPDATE_EVENT, handleReceivedUpdate);
    };
  }, [socket]);

  useEffect(() => {
    startMyTimer();
    startOpponentTimer();

    return () => {
      stopMyTimer();
      stopOpponentTimer();
    };
  }, []);

  function sendMoveUpdate(move: moveType) {
    socket?.emit(GameEvent.MOVE_UPDATE_EVENT, gameId, move);
  }

  function makeAMove(move: moveType) {
    //check if player is trying to move opponent's chess pieces
    if (gameState.turn() === "w" && boardOrientation === "black") {
      return null;
    }

    if (gameState.turn() === "b" && boardOrientation === "white") {
      return null;
    }

    //play move
    const result = gameState.move({
      from: move.from,
      to: move.to,
    });

    return result; // null if the move was illegal, the move object if the move was legal
  }

  function onDrop(sourceSquare: Square, targetSquare: Square) {
    console.log({ sourceSquare, targetSquare });

    const move = {
      from: sourceSquare,
      to: targetSquare,
      //promotion: "q", // always promote to a queen for example simplicity
    };

    sendMoveUpdate(move);
    const result = makeAMove(move);

    //illegal move
    if (result === null) {
      return false;
    }

    stopMyTimer();
    startOpponentTimer();

    return true;
  }

  return (
    <div>
      <div>
        <div>{opponentInfo.username}</div>
        <CountDown minLeft={opponentMinLeft} secLeft={opponentSecLeft} />
      </div>

      <Chessboard
        position={gameState.fen()}
        arePremovesAllowed={true}
        autoPromoteToQueen={true}
        boardOrientation={boardOrientation}
        clearPremovesOnRightClick={true}
        onPieceDrop={onDrop}
      />
      <div>
        <div>{myInfo.username}</div>
        <CountDown minLeft={myMinLeft} secLeft={mySecLeft} />
      </div>
    </div>
  );
}
