import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GameHistory } from "../components/GamesHistory";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Separator } from "@radix-ui/react-separator";
import { useAuth } from "@/hooks/auth";
import blitz from "../assets/blitz.svg";
import clock from "../assets/clock.svg";
import avatar from "../assets/avatar.svg";

export default function UserProfile() {
  const { authUser } = useAuth();

  const friendList = Array.from({ length: 5 }).map((_, i) => `Friend ${i + 1}`);

  return (
    <>
      <Navbar />
      <div className=" w-100 min-h-[1200px] bg-stone-700 pt-10 px-64">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
          <div className="col-span-2">
            <div className="bg-stone-800 text-white p-4 rounded-md">
              <div className="flex">
                <div>
                  <img className="w-56" src={avatar} alt="" />
                </div>
                <div>
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
              </div>
            </div>
            <div className="mt-7">
              <Tabs defaultValue="Games">
                <TabsList className="grid w-full grid-cols-2 h-14">
                  <TabsTrigger value="Games" className="text-2xl p-2">
                    Games
                  </TabsTrigger>
                  <TabsTrigger value="Tournaments" className="text-2xl p-2">
                    Tournaments
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="Games">
                  <div className="mt-5">
                    <GameHistory />
                  </div>
                </TabsContent>
                <TabsContent value="Tournaments">
                  <div className="mt-5">
                    <GameHistory />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <div>
            <div className="bg-stone-800 p-5 rounded-md pr-10">
              <h3 className="text-2xl">Stats</h3>
              <div className="flex justify-between">
                <span>Total Games</span>
                <span>74</span>
              </div>
              <div className="flex justify-between">
                <span>Blitz Games</span>
                <span>4</span>
              </div>
              <div className="flex justify-between">
                <span>Rapid Games</span>
                <span>64</span>
              </div>
              <div className="flex justify-between">
                <span>Total Games</span>
                <span>74</span>
              </div>
              <div className="flex justify-between">
                <span>Blitz Rating</span>
                <span>455</span>
              </div>
              <div className="flex justify-between">
                <span>Rapid Rating</span>
                <span>74</span>
              </div>
            </div>

            <div className="mt-5 bg-stone-800 rounded-md">
              <ScrollArea>
                <ScrollArea className=" border min-h-44">
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
