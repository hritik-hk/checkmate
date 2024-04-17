import { Chessboard } from "react-chessboard";
import { Square } from "react-chessboard/dist/chessboard/types";
import _ from "lodash";
import { moveType } from "../interfaces/common";
import { useSocket } from "../hooks/socket";

export default function Board() {
  const { sendMoveUpdate, gameState, setGameState } = useSocket();

  function makeAMove(move: moveType) {
    // console.log(game.ascii());
    const gameCopy = _.cloneDeep(gameState);
    const result = gameCopy.move(move);
    setGameState(gameCopy);
    if (result) {
      sendMoveUpdate(gameCopy.fen());
    }
    console.log("after you made move", gameCopy.ascii());
    return result; // null if the move was illegal, the move object if the move was legal
  }

  // function makeRandomMove() {
  //   const possibleMoves = game.moves();
  //   console.log("fen", game.fen());
  //   console.log("possible moves", possibleMoves);
  //   if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0) {
  //     console.log("game over");
  //     return; // exit if the game is over
  //   }
  //   const randomIndex = Math.floor(Math.random() * possibleMoves.length);
  //   makeAMove(possibleMoves[randomIndex]);
  // }

  function onDrop(sourceSquare: Square, targetSquare: Square) {
    console.log(sourceSquare, "to", targetSquare);

    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      //promotion: "q", // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) {
      return false;
    }
    // } else {
    //   sendMoveUpdate({
    //     from: sourceSquare,
    //     to: targetSquare,
    //     //promotion: "q", // always promote to a queen for example simplicity
    //   });
    // }

    // console.log(game.ascii());

    return true;
  }

  return (
    <Chessboard
      position={gameState.fen()}
      arePremovesAllowed={true}
      autoPromoteToQueen={true}
      boardOrientation={"black"}
      clearPremovesOnRightClick={true}
      onPieceDrop={onDrop}
    />
  );
}
