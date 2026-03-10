import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GameHistory } from "./GamesHistory";
import TournamentsHistory from "./TournamentsHistory";
import { Link } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";
import { TournamentInfo } from "@/interfaces/common";

export function ActiveEvents({
  gamesHistory,
  onGoingGame,
  tournamentHistory,
  onGoingTournament,
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
          {onGoingTournament.length === 0 ? (
            <p className="text-xl p-4">No ongoing Tournaments...</p>
          ) : (
            onGoingTournament.map((item: TournamentInfo) => {
              return (
                <div key={item.tournament.id}>
                  <Link to={`/tournament/${item.tournament.id}`}>
                    <div className="p-4 text-yellow-500 font-semibold">
                      <FaExternalLinkAlt className=" inline-block" />
                      <span className="sm:text-lg"> In Progress: </span>
                      <span className="sm:text-lg">{` ${item.tournament.name} `}</span>
                      <span className="sm:text-lg">{` (${item.tournament.gameType})`}</span>
                    </div>
                  </Link>
                </div>
              );
            })
          )}
        </div>
        <div className="mt-5">
          <TournamentsHistory tournamentHistory={tournamentHistory} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
