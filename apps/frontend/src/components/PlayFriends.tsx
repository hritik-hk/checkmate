import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSocket } from "@/hooks/socket";
import { useEffect, useState } from "react";
import { GameEvent } from "../utils/constant";
import { getUserByUsername } from "../api/user";
import { Button } from "./ui/button";
import friend from "../assets/friend.svg";
import { IFriend, IUser } from "@/interfaces/common";
import ChooseFriend from "./ChooseFriend";
import { toast } from "sonner";

export function PlayFriends({ userFriends }: { userFriends: IFriend[] }) {
  const { socket } = useSocket();

  const [game, setGame] = useState<{
    gameType: string;
    gameDuration: number;
  } | null>(null);

  const [friendUsername, setFriendUsername] = useState<string>("");
  const [opponentUser, setOpponentUser] = useState<IUser | null>(null);

  const options = [
    {
      label: "⚡BLITZ",
      gameType: "BLITZ",
      value: [
        { label: "3 min", value: 3 * 60000 },
        { label: "5 min", value: 5 * 60000 },
      ],
    },
    {
      label: "⌛RAPID",
      gameType: "RAPID",
      value: [
        { label: "10 min", value: 10 * 60000 },
        { label: "30 min", value: 30 * 60000 },
      ],
    },
  ];

  async function handleSearch() {
    if (friendUsername === "") return;

    console.log(friendUsername);

    const user = await getUserByUsername(friendUsername);
    if (user) {
      setOpponentUser(user);
    } else {
      //TO Do: display invalid email or username
      console.log("invalid email or username");
    }
  }

  function handlePlay() {
    if (opponentUser && game) {
      socket?.emit(GameEvent.GAME_REQUEST, opponentUser.id, game);
    } else {
      toast.error("Either Game-Type or Friend not selected !");
    }
  }

  function handlegame(gameType: string, gameDuration: number) {
    setGame({ gameType, gameDuration });
  }

  useEffect(() => {
    handleSearch();
  }, [friendUsername]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-3/4 text-2xl text-white bg-stone-800 hover:bg-neutral-600 font-md tracking-wide rounded-lg px-10 py-10">
          <span className="mr-3">
            <img className="w-14" src={friend} alt="" />
          </span>
          Play with friend
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[400px] md:max-w-[425px] bg-stone-700">
        <DialogHeader>
          <DialogTitle>Play with friend</DialogTitle>
        </DialogHeader>
        <div>Choose a game type</div>
        <div className="mb-4">
          {options.map((type) => {
            return (
              <div key={type.label}>
                <div>{type.label}</div>
                <div className="my-4">
                  {type.value.map((duration) => {
                    return (
                      <span
                        key={duration.label}
                        className="mx-2 py-3 px-5 rounded-md bg-stone-600 font-bold text-white cursor-pointer"
                        style={
                          game?.gameDuration === duration.value
                            ? { border: "2px solid yellow" }
                            : { border: "none" }
                        }
                        onClick={() =>
                          handlegame(type.gameType, duration.value)
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

        <div className="">Select a friend</div>
        <div className="relative">
          <Input
            className="h-12 text-md"
            placeholder="Search by username"
            onChange={(e: any) => setFriendUsername(e.target.value)}
          ></Input>
          <Button
            className="absolute end-2.5 bottom-1.5"
            onClick={handleSearch}
          >
            search
          </Button>
        </div>

        <ChooseFriend
          userFriends={userFriends}
          friendUsername={friendUsername}
          setFriendUsername={setFriendUsername}
        />

        <DialogFooter>
          <Button onClick={handlePlay}>
            Play {opponentUser !== null ? `with ${opponentUser.username}` : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
