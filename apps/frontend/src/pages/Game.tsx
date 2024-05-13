import { useEffect } from "react";
import Board from "../components/Board";
import { useSocket } from "@/hooks/socket";
import { GameEvent } from "@/utils/constant";
import { useParams } from "react-router-dom";
import { useGame } from "@/hooks/game";
import { useAuth } from "@/hooks/auth";
import Navbar from "@/components/Navbar";

export default function Game() {
  const { socket } = useSocket();
  const { gameId } = useParams();
  const { authUser } = useAuth();

  const {
    currGameInfo,
    gameState,
    myCountDown,
    setMyCountDown,
    opponentCountDown,
    setOpponentCountDown,
  } = useGame();

  useEffect(() => {
    if (socket) {
      socket.emit(GameEvent.JOIN_GAME, gameId);
    }
  }, [socket]);

  return (
    <>
      <Navbar />
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
              />
            </div>
          </div>
        )}
    </>
  );
}
