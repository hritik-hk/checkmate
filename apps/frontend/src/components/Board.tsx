import { Chessboard } from "react-chessboard";
import { Square } from "react-chessboard/dist/chessboard/types";
import { useSocket } from "../hooks/socket";
import { useAuth } from "../hooks/auth";
import { activeGame } from "../interfaces/common";

export default function Board() {
  const { authUser } = useAuth();
  const { sendMoveUpdate, gameState } = useSocket();
  const activeGameExits = localStorage.getItem("activeGame");
  let activeGame: activeGame | null = null;
  if (activeGameExits) {
    activeGame = JSON.parse(activeGameExits);
  }

  // function makeAMove(move: move) {
  //   // console.log(game.ascii());
  //   // const gameCopy = _.cloneDeep(gameState);
  //   // const result = gameCopy.move(move);
  //   //setGameState(gameCopy);

  //   sendMoveUpdate(move);

  //   console.log("after you made move", gameCopy.ascii());
  //   return result; // null if the move was illegal, the move object if the move was legal
  // }

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

  function onDrop(sourceSquare: Square, targetSquare: Square, piece: string) {
    console.log({ sourceSquare, targetSquare, piece });

    const move = {
      from: sourceSquare,
      to: targetSquare,
      piece,
      //promotion: "q", // always promote to a queen for example simplicity
    };

    sendMoveUpdate(move);

    // illegal move
    // if (move === null) {
    //   return false;
    //}
    // } else {
    //   sendMoveUpdate({
    //     from: sourceSquare,
    //     to: targetSquare,
    //     //promotion: "q", // always promote to a queen for example simplicity
    //   });
    // }

    // console.log(game.ascii());

    return false;
  }

  return (
    <Chessboard
      position={gameState.fen()}
      arePremovesAllowed={true}
      autoPromoteToQueen={true}
      boardOrientation={
        authUser?.id === activeGame?.whitePlayerId ? "white" : "black"
      }
      clearPremovesOnRightClick={true}
      onPieceDrop={onDrop}
    />
  );
}
