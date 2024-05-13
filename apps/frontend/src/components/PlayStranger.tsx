import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import stranger from "../assets/stranger.svg";
import { startRandomGame } from "@/api/game";
import blitz from "../assets/blitz.svg";
import rapid from "../assets/clock.svg";
import { useState } from "react";

export default function PlayStranger() {
  const [gameType, setGameType] = useState<string | null>(null);

  async function handleRandomGame() {
    try {
      await startRandomGame();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-3/4 text-2xl text-white bg-stone-800 hover:bg-neutral-600 font-md tracking-wide rounded-lg px-10 py-10">
          <span className="mr-3">
            <img className="w-20" src={stranger} alt="" />
          </span>
          Play with Stranger
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[400px] md:max-w-[425px] bg-stone-700">
        <DialogHeader>
          <DialogTitle>Play with Stranger</DialogTitle>
        </DialogHeader>
        <div>Choose a game type</div>
        <div className="flex justify-around items-center px-12">
          <p
            className="p-2 rounded-md"
            style={
              gameType === "RAPID"
                ? { border: "2px solid yellow" }
                : { border: "none" }
            }
            onClick={() => setGameType("RAPID")}
          >
            <span className="mr-1">
              <img className="w-10 inline-block" src={rapid} alt="" />
            </span>
            <span className="text-xl tracking-wide font-medium">Rapid</span>
          </p>
          <p
            className="p-2 rounded-md"
            style={
              gameType === "BLITZ"
                ? { border: "2px solid yellow" }
                : { border: "none" }
            }
            onClick={() => setGameType("BLITZ")}
          >
            <span className="m-1">
              <img className="w-8 inline-block" src={blitz} alt="" />
            </span>
            <span className="text-xl tracking-wide font-medium">Blitz</span>
          </p>
        </div>

        <DialogFooter>
          <Button onClick={handleRandomGame}>Play</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
