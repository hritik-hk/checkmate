import { useEffect } from "react";
import Board from "../components/Board";
import { useSocket } from "@/hooks/socket";
import { GameEvent } from "@/utils/constant";
import { useParams } from "react-router-dom";
import { useGame } from "@/hooks/game";
import { useAuth } from "@/hooks/auth";

export default function Game() {
  const { socket } = useSocket();
  const { gameId } = useParams();
  const { authUser } = useAuth();

  const { currGameInfo, gameState } = useGame();

  useEffect(() => {
    if (socket) {
      socket.emit(GameEvent.JOIN_GAME, gameId);
    }
  }, [socket]);

  return (
    <>
      {currGameInfo && authUser && gameState && (
        <div className="bg-stone-700">
          <div className="w-[600px] h-[600px]">
            <div className="text-4xl">OPPONENT INFO AND TIME</div>
            <Board
              gameId={currGameInfo?.gameId}
              gameState={gameState}
              boardOrientation={
                currGameInfo.whitePlayer == authUser?.id ? "white" : "black"
              }
            />
            <div className="text-4xl">My INFO AND TIME</div>
          </div>
        </div>
      )}
    </>
  );
}
