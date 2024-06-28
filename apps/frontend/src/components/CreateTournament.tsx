import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { getUserByUsername } from "../api/user";
import { Button } from "./ui/button";
import tournament from "../assets/tournament.svg";
import { Cross2Icon } from "@radix-ui/react-icons";
import ChooseFriend from "./ChooseFriend";
import { IFriend } from "@/interfaces/common";
import { toast } from "sonner";
import { createTournament } from "@/api/tournament";
import { useAuth } from "@/hooks/auth";

export function CreateTournament({ userFriends }: { userFriends: IFriend[] }) {
  const { authUser } = useAuth();

  const [gameType, setGameType] = useState<{
    type: string;
    duration: number;
  } | null>(null);

  const [friendUsername, setFriendUsername] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [participants, setParticipants] = useState<string[]>([
    authUser?.username as string,
  ]);

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

  function removeParticipants(username: string) {
    const updatedParticipants = participants.filter(
      (player) => player !== username
    );
    setParticipants(updatedParticipants);
  }

  async function handleSearch() {
    if (search === "") return;

    const user = await getUserByUsername(search);
    if (user) {
      if (user.id === authUser?.id) {
        toast.error("You cannot select yourself!");
      } else {
        setFriendUsername(search);
      }
    } else {
      console.log("invalid username");
      toast.error("Invalid username");
    }
  }

  async function handleCreateTournament() {
    if (gameType && participants.length > 2) {
      const data = await createTournament({
        participants,
        gameType: gameType.type,
        gameDuration: gameType.duration,
      });

      if (data === null) {
        toast.error("Error creating tournament, Plz try again!!");
      }
    } else if (participants.length < 3) {
      toast.error("select atleast 3 participants");
    } else {
      toast.error("game type not selected");
    }
  }

  function handleGametype(type: string, duration: number) {
    setGameType({ type, duration });
  }

  useEffect(() => {
    if (friendUsername !== "") {
      if (!participants.includes(friendUsername)) {
        setParticipants((prev) => [...prev, friendUsername]);
      }
    }
  }, [friendUsername]);

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
        <div>#Choose game type in tournament</div>
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
                          handleGametype(type.gameType, duration.value)
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

        <div className="">#Select friends</div>
        {participants && (
          <div className="flex">
            <p>participants: </p>
            <div className="flex flex-wrap">
              {participants.map((player) => {
                return (
                  <p className="mx-1 mb-1 py-1 px-1 rounded-md bg-stone-600 text-sm text-white inline-block">
                    {player}{" "}
                    <span
                      className="inline-block cursor-pointer"
                      onClick={() => removeParticipants(player)}
                    >
                      <Cross2Icon className="w-7" />
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
            placeholder="Search by username"
            onChange={(e: any) => setSearch(e.target.value)}
          ></Input>
          <Button
            className="absolute end-2.5 bottom-1.5"
            onClick={handleSearch}
          >
            add
          </Button>
        </div>

        <ChooseFriend
          userFriends={userFriends}
          participants={participants}
          friendUsername={friendUsername}
          setFriendUsername={setFriendUsername}
        />

        <DialogFooter>
          <Button onClick={handleCreateTournament}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
