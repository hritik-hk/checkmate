import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GameHistory } from "./GamesHistory";

export function ActiveEvents({ gamesHistory, tournamentHistory }: any) {
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
        <div className="min-h-36 bg-stone-800">
          <p className="text-xl py-4">No ongoing games...</p>
        </div>
        <div className="mt-5">
          <GameHistory gamesHistory={gamesHistory} />
        </div>
      </TabsContent>
      <TabsContent value="Tournaments">
        <div className="min-h-36 bg-stone-800">
          <p className="text-xl py-4">No ongoing Tournaments...</p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
