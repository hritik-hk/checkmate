import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface BotGameOverProps {
  isGameOver: boolean;
  winner: "player" | "bot" | "draw";
  reason: string;
  onPlayAgain: () => void;
}

export default function BotGameOver({
  isGameOver,
  winner,
  reason,
  onPlayAgain,
}: BotGameOverProps) {
  const navigate = useNavigate();

  function getTitle() {
    if (winner === "player") return "🎉 You won!";
    if (winner === "bot") return "🤖 Bot won!";
    return "🤝 Draw!";
  }

  return (
    <Dialog open={isGameOver}>
      <DialogContent className="max-w-[400px] md:max-w-[425px] bg-stone-700">
        <DialogHeader>
          <DialogTitle className="text-2xl">{getTitle()}</DialogTitle>
        </DialogHeader>
        <div className="text-gray-300">
          due to <span className="font-semibold text-white">{reason}</span>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button
            onClick={onPlayAgain}
            className="bg-green-700 hover:bg-green-600"
          >
            Play Again
          </Button>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="border-stone-500"
          >
            Go Home
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
