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
import friend from "../assets/friend.svg";

export function PlayFriends() {
  const navigate = useNavigate();
  const { socket } = useSocket();

  const [gameType, setGameType] = useState<{
    type: string;
    duration: number;
  } | null>(null);

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

  async function handleSearch(e: any) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData) as {
      username: string;
      gameType: string;
      gameDuration: string;
    };
    console.log(data);
    const opponentUser = await getUserByUsername(data.username);
    if (opponentUser) {
      socket?.emit(GameEvent.GAME_REQUEST, opponentUser.id, data);
    }
  }

  const friendList = Array.from({ length: 5 }).map((_, i) => `Friend ${i + 1}`);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-2xl text-white bg-neutral-800 hover:bg-neutral-600 font-md tracking-wide rounded-lg px-10 py-10">
          <span className="mr-3">
            <img className="w-14" src={friend} alt="" />
          </span>
          Play with friend
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Play with friend</DialogTitle>
        </DialogHeader>
        <div>Choose Game type</div>
        <div className="mb-4">
          {options.map((type) => {
            return (
              <div>
                <div>{type.label}</div>
                <div className="my-4">
                  {type.value.map((duration) => {
                    return (
                      <span className="mx-2 p-2 rounded-md bg-gray-200 font-bold text-gray-900">
                        {duration.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="">Select friend</div>
        <div className="relative">
          <Input
            className="h-12 text-md"
            placeholder="Search by email or username"
          ></Input>
          <Button className="absolute end-2.5 bottom-1.5">search</Button>
        </div>
        <ScrollArea>
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
          <Button onClick={handleSearch}>Play</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
