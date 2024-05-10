import { Chessboard } from "react-chessboard";
import { Square } from "react-chessboard/dist/chessboard/types";
import { boardProps } from "../interfaces/common";
import { useSocket } from "@/hooks/socket";
import { GameEvent } from "@/utils/constant";
import { moveType } from "../interfaces/common";

export default function Board({
  gameId,
  gameState,
  boardOrientation,
}: boardProps) {
  const { socket } = useSocket();

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

  function onDrop(sourceSquare: Square, targetSquare: Square, piece: string) {
    console.log({ sourceSquare, targetSquare, piece });

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

    return true;
  }

  return (
    <Chessboard
      position={gameState.fen()}
      arePremovesAllowed={true}
      autoPromoteToQueen={true}
      boardOrientation={boardOrientation}
      clearPremovesOnRightClick={true}
      onPieceDrop={onDrop}
    />
  );
}
