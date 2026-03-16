import { useEffect, useRef, useState, useCallback } from "react";
import { Chess } from "chess.js";
import Navbar from "@/components/Navbar";
import BotBoard from "@/components/BotBoard";
import BotGameOver from "@/components/BotGameOver";
import { useAuth } from "@/hooks/auth";

const LOCAL_STORAGE_KEY = "botGameFen";
const BOT_DEPTH = 3;

export default function BotGame() {
  const { authUser } = useAuth();
  const workerRef = useRef<Worker | null>(null);

  // Load saved FEN from localStorage or start a new game
  const [gameState, setGameState] = useState<Chess>(() => {
    const savedFen = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedFen) {
      try {
        return new Chess(savedFen);
      } catch {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
    return new Chess();
  });

  const [isBotThinking, setIsBotThinking] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<"player" | "bot" | "draw">("draw");
  const [reason, setReason] = useState("");

  // Initialize the web worker
  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/botEngine.ts", import.meta.url),
      { type: "module" }
    );

    workerRef.current.onmessage = (
      event: MessageEvent<{ bestMove: any }>
    ) => {
      const { bestMove } = event.data;

      if (bestMove) {
        setGameState((prev) => {
          const gameCopy = new Chess(prev.fen());
          gameCopy.move(bestMove);
          // Save to localStorage
          localStorage.setItem(LOCAL_STORAGE_KEY, gameCopy.fen());
          return gameCopy;
        });
      }

      setIsBotThinking(false);
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  // Check for game-over conditions whenever gameState changes
  useEffect(() => {
    if (gameState.isGameOver()) {
      handleGameEnd(gameState);
    }
    // If game was restored and it's bot's turn, trigger bot move
    if (
      !gameState.isGameOver() &&
      gameState.turn() === "b" &&
      !isBotThinking
    ) {
      triggerBotMove(gameState.fen());
    }
  }, []); // only on mount for restored games

  const handleGameEnd = useCallback((game: Chess) => {
    setIsGameOver(true);
    localStorage.removeItem(LOCAL_STORAGE_KEY);

    if (game.isCheckmate()) {
      // The side whose turn it is has been checkmated
      if (game.turn() === "b") {
        setWinner("player");
      } else {
        setWinner("bot");
      }
      setReason("CHECKMATE");
    } else if (game.isStalemate()) {
      setWinner("draw");
      setReason("STALEMATE");
    } else if (game.isDraw()) {
      setWinner("draw");
      setReason("DRAW");
    } else if (game.isThreefoldRepetition()) {
      setWinner("draw");
      setReason("THREEFOLD REPETITION");
    } else if (game.isInsufficientMaterial()) {
      setWinner("draw");
      setReason("INSUFFICIENT MATERIAL");
    }
  }, []);

  function triggerBotMove(fen: string) {
    if (!workerRef.current) return;
    setIsBotThinking(true);
    workerRef.current.postMessage({ fen, depth: BOT_DEPTH });
  }

  // Called when the player makes a move
  function handlePlayerMove(updatedGame: Chess) {
    setGameState(updatedGame);
    localStorage.setItem(LOCAL_STORAGE_KEY, updatedGame.fen());

    if (updatedGame.isGameOver()) {
      handleGameEnd(updatedGame);
      return;
    }

    // Trigger bot's move
    triggerBotMove(updatedGame.fen());
  }

  // Check if the bot's response caused a game-over
  useEffect(() => {
    if (!isBotThinking && gameState.isGameOver() && !isGameOver) {
      handleGameEnd(gameState);
    }
  }, [gameState, isBotThinking, isGameOver, handleGameEnd]);

  function handleResign() {
    setIsGameOver(true);
    setWinner("bot");
    setReason("RESIGNATION");
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }

  function handlePlayAgain() {
    const freshGame = new Chess();
    setGameState(freshGame);
    setIsGameOver(false);
    setWinner("draw");
    setReason("");
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }

  return (
    <>
      <Navbar />
      <BotGameOver
        isGameOver={isGameOver}
        winner={winner}
        reason={reason}
        onPlayAgain={handlePlayAgain}
      />
      <div className="flex justify-center bg-stone-700 h-screen py-5">
        <div className="w-screen sm:w-[550px]">
          <BotBoard
            gameState={gameState}
            onPlayerMove={handlePlayerMove}
            isGameOver={isGameOver}
            isBotThinking={isBotThinking}
            playerName={authUser?.username ?? "You"}
            onResign={handleResign}
          />
        </div>
      </div>
    </>
  );
}
