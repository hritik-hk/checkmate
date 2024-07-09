import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { points } from "@/interfaces/common";

export default function PointsTable({
  pointsTable,
}: {
  pointsTable: points[];
}) {
  return (
    <>
      <div>
        <div>
          <Table className="bg-stone-900">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Position</TableHead>
                <TableHead>Player</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pointsTable.map((player, index) => (
                <TableRow key={index}>
                  <TableCell className="font-bold">
                    {`#${player.position}`}
                  </TableCell>
                  <TableCell>{player.player_username}</TableCell>
                  <TableCell>{player.point}</TableCell>
                  <TableCell>{player.rating}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {/* ongoing games in tournament */}
        <div>
          <h2 className="text-lg sm:text-2xl font-semibold tracking-wide font-mono bg-stone-900 mt-5 mb-3 rounded-md p-3">
            Ongoing Tournament Games
          </h2>
          <div className="min-h-20 sm:min-h-36 p-4 rounded-md bg-stone-800">
            <p className="text-xl py-4">No ongoing games...</p>
          </div>
        </div>
      </div>
    </>
  );
}
