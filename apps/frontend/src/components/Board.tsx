import { Chessboard } from "react-chessboard";
import { Square } from "react-chessboard/dist/chessboard/types";
import { boardProps } from "../interfaces/common";
import { useSocket } from "@/hooks/socket";
import { GameEvent } from "@/utils/constant";
import { moveType } from "../interfaces/common";
import CountDown from "./CountDown";
import { useRef, useEffect } from "react";
import lodash from "lodash";
import { Chess } from "chess.js";
import { checkPromotion } from "@/utils/helpers";

export default function Board({
  gameId,
  gameState,
  setGameState,
  isGameOver,
  boardOrientation,
  myCountDown,
  opponentCountDown,
  setMyCountDown,
  setOpponentCountDown,
  opponentInfo,
  myInfo,
  whitePlayerId,
  gameType,
}: boardProps) {
  const { socket } = useSocket();

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
          if (prevSeconds === null) return null;
          else if (prevSeconds <= 1) {
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
          if (prevSeconds === null) return null;
          else if (prevSeconds <= 1) {
            stopOpponentTimer();
            return 0;
          } else return prevSeconds - 1;
        });
      }, 1000); // Update every second
    }
  };

  const handleReceivedUpdate = async (boardFen: string) => {
    setGameState(new Chess(boardFen));

    //to stop timers on game-over
    const tempState = new Chess(boardFen);
    if (tempState.isGameOver()) return;

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
    if (gameState.turn() === "w" && whitePlayerId === myInfo.id) {
      startMyTimer();
    } else if (gameState.turn() === "b" && whitePlayerId !== myInfo.id) {
      startMyTimer();
    } else {
      startOpponentTimer();
    }

    return () => {
      stopMyTimer();
      stopOpponentTimer();
    };
  }, []);

  useEffect(() => {
    if (isGameOver) {
      stopMyTimer();
      stopOpponentTimer();
    }
  }, [isGameOver]);

  function sendMoveUpdate(move: moveType) {
    socket?.emit(GameEvent.MOVE_UPDATE_EVENT, gameId, JSON.stringify(move));
  }

  function makeAMove(move: moveType) {
    const gameCopy = lodash.cloneDeep(gameState);
    try {
      //check if player is trying to move opponent's chess pieces
      if (gameState.turn() === "w" && boardOrientation === "black") {
        return null;
      }

      if (gameState.turn() === "b" && boardOrientation === "white") {
        return null;
      }

      //play move
      let result = null;

      if (checkPromotion(gameCopy, move.from, move.to)) {
        result = gameCopy.move({
          from: move.from,
          to: move.to,
          promotion: "q", // promote to queen by default for NOW!!
        });
      } else {
        result = gameCopy.move({
          from: move.from,
          to: move.to,
        });
      }

      setGameState(gameCopy);
      console.log("now turn of: ", gameCopy.turn());

      return result; // null if the move was illegal, the move object if the move was legal
    } catch (err) {
      console.log("error playing move: ", err);
      setGameState(gameCopy);
      console.log("now turn of: ", gameCopy.turn());
      return null;
    }
  }

  function onDrop(sourceSquare: Square, targetSquare: Square) {
    console.log("playing from here", { sourceSquare, targetSquare });

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
      <div className="flex justify-between mb-3 bg-neutral-900 rounded-md p-3">
        <div className="text-xl font-sans font-semibold">
          {opponentInfo.username}
          <span className="text-base font-medium text-gray-400 ml-1">
            {gameType === "RAPID"
              ? `(${opponentInfo.rapid_rating})`
              : `(${opponentInfo.blitz_rating})`}
          </span>
        </div>
        {opponentCountDown && <CountDown seconds={opponentCountDown} />}
      </div>

      <Chessboard
        position={gameState.fen()}
        boardOrientation={boardOrientation}
        autoPromoteToQueen={true}
        onPieceDrop={onDrop}
      />

      <div className="flex justify-between mt-3 bg-neutral-900 rounded-md p-3">
        <div className="text-xl font-sans font-semibold">
          {myInfo.username}
          <span className="text-base font-medium text-gray-400 ml-1">
            {gameType === "RAPID"
              ? `(${myInfo.rapid_rating})`
              : `(${myInfo.blitz_rating})`}
          </span>
        </div>
        {myCountDown && <CountDown seconds={myCountDown} />}
      </div>
    </div>
  );
}
