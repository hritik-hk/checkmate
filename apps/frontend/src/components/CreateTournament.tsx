import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useSocket } from "@/hooks/socket";
import { useState } from "react";
import { GameEvent } from "../utils/constant";
import { getUserByUsername } from "../api/user";
import { Button } from "./ui/button";
import tournament from "../assets/tournament.svg";
import { user } from "@/interfaces/common";
import { Cross2Icon } from "@radix-ui/react-icons";

export function CreateTournament() {
  const navigate = useNavigate();
  const { socket } = useSocket();

  const [gameType, setGameType] = useState<{
    type: string;
    duration: number;
  } | null>(null);

  const [friendUsername, setFriendUsername] = useState<string | null>(null);
  const [opponentUser, setOpponentUser] = useState<user | null>(null);

  const options = [
    {
      label: "⚡BLITZ",
      value: [
        { label: "3 min", value: 3 * 600000 },
        { label: "5 min", value: 5 * 600000 },
      ],
    },
    {
      label: "⌛RAPID",
      value: [
        { label: "10 min", value: 10 * 600000 },
        { label: "30 min", value: 30 * 600000 },
      ],
    },
  ];

  async function handleSearch() {
    if (friendUsername === null) return;

    console.log(friendUsername);

    const user = await getUserByUsername(friendUsername);
    if (user) {
      setOpponentUser(user);
    } else {
      //to do display invalid email or username
      console.log("invalid email or username");
    }
  }

  function handlePlay() {
    if (opponentUser) {
      socket?.emit(GameEvent.GAME_REQUEST, opponentUser);
    }
  }

  const friendList = Array.from({ length: 5 }).map((_, i) => `Friend ${i + 1}`);
  const participants = [
    "hritik",
    "sara",
    "nikki",
    "daksh",
    "sara",
    "nikki",
    "daksh",
  ];

  function handleGametype(type: string, duration: number) {
    setGameType({ type, duration });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-3/4  text-2xl text-white bg-stone-800 hover:bg-neutral-600 font-md tracking-wide rounded-lg px-10 py-10">
          <span className="mr-3">
            <img className="w-14" src={tournament} alt="" />
          </span>
          Create Tournament
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[400px] md:max-w-[425px] bg-stone-700">
        <DialogHeader>
          <DialogTitle> Create Tournament</DialogTitle>
        </DialogHeader>
        <div>Choose game type in tournament</div>
        <div className="mb-4">
          {options.map((type) => {
            return (
              <div>
                <div>{type.label}</div>
                <div className="my-4">
                  {type.value.map((duration) => {
                    return (
                      <span
                        className="mx-2 py-3 px-5 rounded-md bg-stone-600 font-bold text-white cursor-pointer"
                        style={
                          gameType?.duration === duration.value
                            ? { border: "2px solid yellow" }
                            : { border: "none" }
                        }
                        onClick={() =>
                          handleGametype(type.label, duration.value)
                        }
                      >
                        {duration.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="">Select friends</div>
        {participants && (
          <div className="flex">
            <p>participants: </p>
            <div className="flex flex-wrap">
              {participants.map((player) => {
                return (
                  <p className="mx-1 mb-1 py-1 px-1 rounded-md bg-stone-600 text-sm text-white inline-block">
                    {player}{" "}
                    <span className="inline-block">
                      <Cross2Icon />
                    </span>
                  </p>
                );
              })}
            </div>
          </div>
        )}
        <div className="relative">
          <Input
            className="h-12 text-md"
            placeholder="Search by email or username"
            onChange={(e: any) => setFriendUsername(e.target.value)}
          ></Input>
          <Button
            className="absolute end-2.5 bottom-1.5"
            onClick={handleSearch}
          >
            search
          </Button>
        </div>
        <ScrollArea className="">
          <ScrollArea className="rounded-md border h-40">
            <div className="p-4">
              <h4 className="mb-4 text-xl font-semibold leading-none">
                Friends ({friendList.length})
              </h4>
              {friendList.map((friend) => (
                <>
                  <div key={friend} className="text-md font-medium">
                    {friend}
                  </div>
                  <Separator className="my-2" />
                </>
              ))}
            </div>
          </ScrollArea>
        </ScrollArea>

        <DialogFooter>
          <Button onClick={handleSearch}>
            Play {friendUsername !== null ? `with ${friendUsername}` : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
