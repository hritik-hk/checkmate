import { Chessboard } from "react-chessboard";
import { Square } from "react-chessboard/dist/chessboard/types";
import { Chess } from "chess.js";
import { checkPromotion } from "@/utils/helpers";
import lodash from "lodash";

interface BotBoardProps {
  gameState: Chess;
  onPlayerMove: (updatedGame: Chess) => void;
  isGameOver: boolean;
  isBotThinking: boolean;
  playerName: string;
  onResign: () => void;
}

export default function BotBoard({
  gameState,
  onPlayerMove,
  isGameOver,
  isBotThinking,
  playerName,
  onResign,
}: BotBoardProps) {
  function onDrop(sourceSquare: Square, targetSquare: Square) {
    // Block moves when it's not player's turn, game is over, or bot is thinking
    if (gameState.turn() !== "w" || isGameOver || isBotThinking) {
      return false;
    }

    const gameCopy = lodash.cloneDeep(gameState);
    try {
      const move = { from: sourceSquare, to: targetSquare };

      let result = null;
      if (checkPromotion(gameCopy, move.from, move.to)) {
        result = gameCopy.move({
          from: move.from,
          to: move.to,
          promotion: "q",
        });
      } else {
        result = gameCopy.move({
          from: move.from,
          to: move.to,
        });
      }

      if (result === null) return false;

      onPlayerMove(gameCopy);
      return true;
    } catch {
      return false;
    }
  }

  return (
    <div>
      {/* Opponent (Bot) info bar */}
      <div className="relative flex justify-between items-center mb-3 bg-neutral-900 rounded-md p-3 min-h-[52px]">
        <div className="text-xl font-sans font-semibold">
          Bot 🤖
          <span className="text-base font-medium text-gray-400 ml-2">
            (Engine)
          </span>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2">
          {isBotThinking ? (
            <div className="flex gap-2">
              <span className="inline-block w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-yellow-400 font-medium text-sm tracking-wide">
                Bot is thinking...
              </span>
            </div>
          ) : (
            <div className="text-green-400 font-medium">Your Turn</div>
          )}
        </div>
      </div>

      <Chessboard
        position={gameState.fen()}
        boardOrientation="white"
        autoPromoteToQueen={true}
        onPieceDrop={onDrop}
        arePiecesDraggable={!isGameOver && !isBotThinking}
      />

      {/* Player info bar */}
      <div className="flex justify-between items-center mt-3 bg-neutral-900 rounded-md p-3">
        <div className="text-xl font-sans font-semibold">
          {playerName}
          <span className="text-base font-medium text-gray-400 ml-2">
            (You)
          </span>
        </div>
      </div>

      {/* Resign button */}
      {!isGameOver && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={onResign}
            className="px-6 py-2 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-md transition-colors duration-200 tracking-wide"
          >
            🏳️ Resign
          </button>
        </div>
      )}
    </div>
  );
}
