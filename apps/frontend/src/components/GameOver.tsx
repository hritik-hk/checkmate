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

export default function GameOver({
  isGameOver,
  gameResult,
  winner,
  gameCategory,
}: any) {
  const { ongoingTournament } = useTournament();
  const navigate = useNavigate();

  function redirectToTournament() {
    navigate(`/tournament/${ongoingTournament}`);
  }

  return (
    <Dialog open={isGameOver}>
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
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
