import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { FaSquarePlus } from "react-icons/fa6";
import { FaMinusSquare } from "react-icons/fa";
import { useAuth } from "@/hooks/auth";

export function GameHistory({ gamesHistory }: any) {
  const { authUser } = useAuth();

  return (
    <>
      {authUser && gamesHistory && (
        <Table className="bg-stone-900">
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 md:w-[100px]">Type</TableHead>
              <TableHead >Players</TableHead>
              <TableHead className="w-[70px]">Result</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gamesHistory.map((game: any, index: number) => (
              <TableRow key={index}>
                <TableCell className="text-xs md:text-base md:font-medium">{game.gameType}</TableCell>
                <TableCell>
                  <div>
                    <div>
                      <span className="w-3 h-3 bg-slate-200 mr-2 md:mr-3 inline-block"></span>
                      <p className="inline-block md:text-base tracking-wide md:font-medium">
                        {game.whitePlayer.username}
                      </p>
                    </div>
                    <span className="h-3 w-3 bg-stone-500 mr-2 md:mr-3 inline-block"></span>
                    <p className="inline-block md:text-base tracking-wide md:font-medium">
                      {game.blackPlayer.username}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="w-fit">
                  <div className="flex justify-center items-center">
                    <div>
                      <p>{game.winnerId === game.whitePlayer.id ? 1 : 0}</p>
                      <p>{game.winnerId === game.blackPlayer.id ? 1 : 0}</p>
                    </div>
                    <div className="px-2">
                      {authUser.id === game.winnerId ? (
                        <FaSquarePlus className="text-green-500 w-5 h-5" />
                      ) : (
                        <FaMinusSquare className="text-red-500 w-5 h-5" />
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-xs md:text-base">
                  {" "}
                  {new Date(game.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
