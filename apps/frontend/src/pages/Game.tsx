import { useEffect, useState, useRef } from "react";
import Board from "../components/Board";
import { useSocket } from "@/hooks/socket";
import { Category, GameEvent, GameResult, Result } from "@/utils/constant";
import { useParams } from "react-router-dom";
import { useGame } from "@/hooks/game";
import { useAuth } from "@/hooks/auth";
import Navbar from "@/components/Navbar";
import GameOver from "@/components/GameOver";

export default function Game() {
  const { socket } = useSocket();
  const { gameId } = useParams();
  const { authUser } = useAuth();
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameResult, setGameResult] = useState("");
  const [winner, setWinner] = useState("");
  const [gameCategory, setGameCategory] = useState<string | null>(null);

  const {
    currGameInfo,
    gameState,
    setGameState,
    myCountDown,
    setMyCountDown,
    opponentCountDown,
    setOpponentCountDown,
  } = useGame();

  //so that currGameInfo is updated without re-rendering
  const currGameInfoRef = useRef<typeof currGameInfo>(null);
  currGameInfoRef.current = currGameInfo;

  function handleGameOver(payload: {
    result: Result;
    winnerId: string | null;
    gameCategory: Category;
  }) {
    console.log("game-over", payload);
    if (currGameInfoRef.current === null) {
      setIsGameOver(true);
      setGameResult(payload.result);
      console.error("currGameInfo is: ", currGameInfo);
      return;
    }

    setIsGameOver(true);
    setGameCategory(payload.gameCategory);

    //TO DO: HANDLE "GAME DRAW" FIRST AS winner ID would be null

    payload.winnerId === currGameInfoRef.current.whitePlayer.id
      ? setWinner(currGameInfoRef.current.whitePlayer.username)
      : setWinner(currGameInfoRef.current.blackPlayer.username);

    if (payload.result === GameResult.CHECKMATE) {
      setGameResult("CHECKMATE");
    } else if (payload.result === GameResult.TIMES_UP) {
      setGameResult("TIMES UP");
    } else if (payload.result === GameResult.ABANDONED) {
      setGameResult("ABANDONMENT");
    }
  }

  useEffect(() => {
    if (socket) {
      socket.emit(GameEvent.JOIN_GAME, gameId);
      socket.on(GameEvent.END_GAME, handleGameOver);
    }

    return () => {
      if (socket) socket.off(GameEvent.END_GAME, handleGameOver);
    };
  }, [socket]);

  return (
    <>
      <Navbar />
      <GameOver
        isGameOver={isGameOver}
        setIsGameOver={setIsGameOver}
        gameResult={gameResult}
        winner={winner}
        gameCategory={gameCategory}
      />
      {currGameInfo &&
        authUser &&
        gameState &&
        myCountDown &&
        opponentCountDown && (
          <div className="flex justify-center bg-stone-700 h-screen py-5">
            <div className="w-screen md:w-2/5">
              <Board
                gameId={currGameInfo?.gameId}
                gameState={gameState}
                setGameState={setGameState}
                isGameOver={isGameOver}
                boardOrientation={
                  currGameInfo.whitePlayer.id == authUser?.id
                    ? "white"
                    : "black"
                }
                whitePlayerId={currGameInfo.whitePlayer.id}
                myCountDown={myCountDown}
                opponentCountDown={opponentCountDown}
                setMyCountDown={setMyCountDown}
                setOpponentCountDown={setOpponentCountDown}
                opponentInfo={
                  currGameInfo?.whitePlayer.id === authUser?.id
                    ? currGameInfo?.blackPlayer
                    : currGameInfo.whitePlayer
                }
                myInfo={
                  currGameInfo?.whitePlayer.id === authUser?.id
                    ? currGameInfo.whitePlayer
                    : currGameInfo?.blackPlayer
                }
                gameType={currGameInfo.gameType}
              />
            </div>
          </div>
        )}
    </>
  );
}
