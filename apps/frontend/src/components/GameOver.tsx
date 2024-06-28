import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { GameCategory } from "@/utils/constant";
import { useTournament } from "@/hooks/tournament";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function GameOver({
  isGameOver,
  setIsGameOver,
  gameResult,
  winner,
  gameCategory,
}: any) {
  const { ongoingTournament } = useTournament();
  const navigate = useNavigate();
  const redirectTimer = useRef<NodeJS.Timeout | null>(null);

  function redirectToTournament() {
    if (redirectTimer.current) {
      clearInterval(redirectTimer.current);
      redirectTimer.current = null;
    }
    console.log("navigating to tournamentId: ", ongoingTournament);
    navigate(`/tournament/${ongoingTournament}`);
  }

  useEffect(() => {
    if (isGameOver && gameCategory === GameCategory.TOURNAMENT_GAME) {
      redirectTimer.current = setTimeout(redirectToTournament, 10000);
    }
  }, [isGameOver]);

  return (
    <Dialog open={isGameOver} onOpenChange={() => setIsGameOver(false)}>
      <DialogContent className="max-w-[400px] md:max-w-[425px] bg-stone-700">
        <DialogHeader>
          <DialogTitle>
            {winner === "" ? "Game Over" : `${winner} won!!`}
          </DialogTitle>
        </DialogHeader>
        <div>by {gameResult}</div>

        {gameCategory === GameCategory.TOURNAMENT_GAME && (
          <DialogFooter>
            <Button onClick={redirectToTournament}>Go To Tournament</Button>
            <div>You will be redirected to tournament page in 10 seconds</div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
