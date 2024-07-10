import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GameHistory } from "./GamesHistory";
import { Link } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";

export function ActiveEvents({
  gamesHistory,
  onGoingGame,
  tournamentHistory,
}: any) {
  return (
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
        <div className="min-h-20 h-md:min-h-36 bg-stone-800">
          {onGoingGame === null ? (
            <p className="text-xl p-4">No ongoing games...</p>
          ) : (
            <Link to={`/game/${onGoingGame.id}`}>
              <div className="p-4 text-yellow-500 font-semibold">
              <FaExternalLinkAlt className=" inline-block" />
                <span className="text-lg"> In Progress: </span>
                <span className="text-lg">{` ${onGoingGame.whitePlayer.username} `}</span>
                vs
                <span className="text-lg">{` ${onGoingGame.blackPlayer.username}`}</span>
                <span className="text-lg">{` (${onGoingGame.gameType})`}</span>
               
              </div>
            </Link>
          )}
        </div>
        <div className="mt-5">
          <GameHistory gamesHistory={gamesHistory} />
        </div>
      </TabsContent>
      <TabsContent value="Tournaments">
        <div className="min-h-20 md:min-h-36 bg-stone-800">
          <p className="text-xl p-4">No ongoing Tournaments...</p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
