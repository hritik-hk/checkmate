import Navbar from "@/components/Navbar";
import { CreateTournament } from "@/components/CreateTournament";
import { PlayFriends } from "@/components/PlayFriends";
import blitz from "../assets/blitz.svg";
import clock from "../assets/clock.svg";
import { useAuth } from "@/hooks/auth";
import { ActiveEvents } from "@/components/ActiveEvents";
import { ScrollArea } from "@/components/ui/scroll-area";
import avatar from "../assets/avatar.svg";
import PlayStranger from "@/components/PlayStranger";
import { useEffect, useState } from "react";
import { getUserByUsername } from "@/api/user";
import { getGamesHistory, getOnGoingGame } from "@/api/game";
import { getTournamentHistory } from "@/api/tournament";
import { GameInfo, IUser } from "@/interfaces/common";
import Connecting from "@/components/Connecting";

export default function Home() {
  const { authUser } = useAuth();

  const [userInfo, setUserInfo] = useState<IUser | null>(null);
  const [gamesHistory, setGamesHistory] = useState<any>(null);
  const [tournamentHistory, setTournamentHistory] = useState<any>(null);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [onGoingGame, SetOnGoingGame] = useState<GameInfo | null>(null);

  function getTotalBlitzGames() {
    let count = 0;
    gamesHistory.forEach((game: any) => {
      if (game.gameType === "BLITZ") {
        count++;
      }
    });

    return count;
  }

  function getTotalRapidGames() {
    let count = 0;
    gamesHistory.forEach((game: any) => {
      if (game.gameType === "RAPID") {
        count++;
      }
    });

    return count;
  }

  useEffect(() => {
    async function fetchUserInfo(username: string) {
      const user = await getUserByUsername(username);
      setUserInfo(user);
    }

    async function fetchGamesHistory(username: string) {
      const gamesHistory = await getGamesHistory(username);
      //sorting games acc to latest datetime
      gamesHistory.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setGamesHistory(gamesHistory);
    }

    async function fetchTournamentHistory(username: string) {
      const data = await getTournamentHistory(username);
      setTournamentHistory(data);
    }

    async function fetchOnGoingGame(userId: string) {
      const data = await getOnGoingGame(userId);
      SetOnGoingGame(data.gameInfo);
    }

    // load userInfo
    if (authUser) {
      // load stats
      //load games played
      //load tournament played
      //load friends
      fetchUserInfo(authUser.username);
      fetchOnGoingGame(authUser.id);
      fetchGamesHistory(authUser.username);
      fetchTournamentHistory(authUser.username);
    }
  }, [authUser]);

  return (
    <>
      <Navbar />
      {userInfo && (
        <div className="min-h-[1200px] bg-stone-700 pt-10 px-6 md:px-64">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
            <div className="bg-stone-800 w-fit text-white p-2 md:p-4 rounded-md">
              <div className="flex">
                <div>
                  <img className="w-28 md:w-56" src={avatar} alt="avatar" />
                </div>
                <div>
                  <div>
                    <p className="text-2xl md:text-4xl tracking-wide font-medium">
                      {userInfo?.username}
                    </p>
                    <p className="text-xs md:text-base">
                      Joined{" "}
                      {new Date(userInfo.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                  <div className="mt-4">
                    <p className="m-1">
                      <span className="m-1">
                        <img
                          className="w-4 md:w-8 inline-block"
                          src={blitz}
                          alt=""
                        />
                      </span>
                      <span className="text-sm md:text-xl tracking-wide font-medium">
                        Blitz rating: {userInfo.blitz_rating}
                      </span>
                    </p>
                    <p className="m-1">
                      <span className="mr-1">
                        <img
                          className="w-6 md:w-10 inline-block"
                          src={clock}
                          alt=""
                        />
                      </span>
                      <span className="text-sm md:text-xl tracking-wide font-medium">
                        Rapid rating: {userInfo.rapid_rating}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-white">
              <div>
                <PlayFriends userFriends={userInfo.friends} />
              </div>
              <div className="my-3">
                <PlayStranger setConnecting={setConnecting} />
              </div>
              <CreateTournament userFriends={userInfo.friends} />
            </div>
          </div>
          <div className="mt-7">
            {gamesHistory && tournamentHistory && (
              <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
                <div className="col-span-2">
                  <ActiveEvents
                    gamesHistory={gamesHistory}
                    onGoingGame={onGoingGame}
                    tournamentHistory={tournamentHistory}
                  />
                </div>
                <div>
                  <div className="bg-stone-800 p-5 rounded-md pr-10">
                    <h3 className="text-2xl">Stats</h3>
                    <div className="flex justify-between">
                      <span>Total Games</span>
                      <span>{gamesHistory.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Blitz Games</span>
                      <span>{getTotalBlitzGames()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rapid Games</span>
                      <span>{getTotalRapidGames()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Blitz Rating</span>
                      <span>{userInfo.blitz_rating}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rapid Rating</span>
                      <span>{userInfo.rapid_rating}</span>
                    </div>
                  </div>

                  <div className="mt-5 bg-stone-800 rounded-md">
                    <ScrollArea>
                      <ScrollArea className=" border min-h-44">
                        <div className="p-4">
                          <h4 className="mb-4 text-xl font-semibold leading-none">
                            Friends ({userInfo.friends.length})
                          </h4>
                          {userInfo.friends.map((friend: any) => (
                            <div key={friend}>
                              <span className="text-md font-medium mx-2">
                                {friend.username}
                              </span>
                              <span className="text-sm font-medium mx-2">
                                BLITZ({friend.blitz_rating})
                              </span>
                              <span className="text-sm font-medium">
                                RAPID ({friend.rapid_rating})
                              </span>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </ScrollArea>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <Connecting connecting={connecting} setConnecting={setConnecting} />
    </>
  );
}
