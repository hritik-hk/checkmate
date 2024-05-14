import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

export default function GameOver({ isGameOver, gameResult, winner }: any) {
  function handleRematch() {
    console.log("logic  to handle rematch");
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

        <DialogFooter>
          <Button onClick={handleRematch}>Rematch</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
