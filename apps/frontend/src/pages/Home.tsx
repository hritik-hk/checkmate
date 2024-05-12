import { startRandomGame } from "../api/game";
import Navbar from "@/components/Navbar";
import { CreateTournament } from "@/components/CreateTournament";
import { PlayFriends } from "@/components/PlayFriends";
import { Button } from "@/components/ui/button";
import stranger from "../assets/stranger.svg";
import blitz from "../assets/blitz.svg";
import clock from "../assets/clock.svg";
import { useAuth } from "@/hooks/auth";

export default function Home() {
  const { authUser } = useAuth();

  async function handleRandomGame() {
    try {
      await startRandomGame();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Navbar />
      <div className=" w-100 h-screen bg-stone-700 pt-10 ">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
          <div className="bg-neutral-800 text-white p-4 rounded-md">
            <div>
              <p className="text-4xl tracking-wide font-medium">
                {authUser?.username}
              </p>
              <p>Joined July 7, 2022</p>
            </div>
            <div className="mt-4">
              <p className="m-1">
                <span className="m-1">
                  <img className="w-8 inline-block" src={blitz} alt="" />
                </span>
                <span className="text-xl tracking-wide font-medium">
                  Blitz rating: 520
                </span>
              </p>
              <p className="m-1">
                <span className="mr-1">
                  <img className="w-10 inline-block" src={clock} alt="" />
                </span>
                <span className="text-xl tracking-wide font-medium">
                  Rapid rating: 877
                </span>
              </p>
            </div>
          </div>
          <div className="text-white">
            <PlayFriends />
            <div className="mt-5">
              <Button
                className="text-2xl text-white bg-neutral-800 hover:bg-neutral-600 font-md tracking-wide rounded-lg px-10 py-10"
                onClick={handleRandomGame}
              >
                <span className="mr-3">
                  <img className="w-20" src={stranger} alt="" />
                </span>
                Play with Stranger
              </Button>
            </div>
            <CreateTournament />
          </div>
        </div>
        <div className="mt-7">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
            <div className="bg-neutral-800 text-white p-4 rounded-md">
              ongoing games
              <div>No games in progress</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
