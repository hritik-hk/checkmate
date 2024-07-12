import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fixtureRow, points } from "@/interfaces/common";
import PointsTable from "./PointsTable";
import TournamentFixture from "./TournamentFixture";

interface TournamentCompactView {
  fixture: fixtureRow[];
  pointsTable: points[];
  tournamentId: string;
  roundId: string;
  status: string;
}

export default function TournamentCompactView({
  fixture,
  pointsTable,
  tournamentId,
  roundId,
  status,
}: TournamentCompactView) {
  return (
    <Tabs defaultValue="PointsTable">
      <TabsList className="grid w-full grid-cols-2 h-16">
        <TabsTrigger value="PointsTable">
          <h2 className="text-base font-semibold tracking-wide font-mon rounded-md p-3">
            Points Table
          </h2>
        </TabsTrigger>
        <TabsTrigger value="TournamentFixture">
          <h2 className="text-base font-semibold tracking-wide font-mono rounded-md p-3">
            Fixture
          </h2>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="PointsTable">
        <PointsTable
          pointsTable={pointsTable}
          tournamentId={tournamentId}
          roundId={roundId}
          status={status}
        />
      </TabsContent>
      <TabsContent value="TournamentFixture">
        <TournamentFixture fixture={fixture} />
      </TabsContent>
    </Tabs>
  );
}
