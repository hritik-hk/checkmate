import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { points } from "@/interfaces/common";
import { useEffect, useState } from "react";
import { GameInfo } from "@/interfaces/common";
import { getOnGoingTournamentGames } from "@/api/tournament";
import { Link } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";

export default function PointsTable({
  pointsTable,
  tournamentId,
  roundId,
  status,
}: {
  pointsTable: points[];
  tournamentId: string;
  roundId: string;
  status: string;
}) {
  const [onGoingGames, setOnGoingGames] = useState<GameInfo[]>([]);

  useEffect(() => {
    async function fetchOnGoingTournamentGames(
      tournamentId: string,
      roundId: string
    ) {
      const data = await getOnGoingTournamentGames(tournamentId, roundId);
      setOnGoingGames(data);
    }

    if (status === "start") {
      setOnGoingGames([]);
    } else if (status === "end") {
      fetchOnGoingTournamentGames(tournamentId, roundId);
    } else if (status === "completed") {
      setOnGoingGames([]);
    }
  }, [status]);

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
          <div className="min-h-20 h-md:min-h-36 bg-stone-800">
            {onGoingGames?.length === 0 ? (
              <p className="text-xl p-4">No ongoing games...</p>
            ) : (
              onGoingGames.map((onGoingGame: GameInfo) => {
                return (
                  <div>
                    {" "}
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
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}
