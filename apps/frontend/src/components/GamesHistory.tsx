import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { FaSquarePlus } from "react-icons/fa6";

const history = [
  {
    type: "BLITZ",
    players: {
      player1: "hritik(623)",
      player2: "sara(499)",
    },
    result: "hritik won",
    date: "May 7, 2024",
  },
  {
    type: "BLITZ",
    players: {
      player1: "laxman",
      player2: "hritik",
    },
    result: "hritik won",
    date: "May 7, 2024",
  },
  {
    type: "RAPID",
    players: {
      player1: "hritik",
      player2: "sarthak",
    },
    result: "hritik won",
    date: "May 7, 2024",
  },
  {
    type: "RAPID",
    players: {
      player1: "hritik",
      player2: "Ash",
    },
    result: "hritik won",
    date: "May 7, 2024",
  },
  {
    type: "BLITZ",
    players: {
      player1: "Abhi",
      player2: "hritik",
    },
    result: "hritik won",
    date: "May 7, 2024",
  },
];

export function GameHistory() {
  return (
    <Table className="bg-stone-900">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Type</TableHead>
          <TableHead>Players</TableHead>
          <TableHead className="w-[70px]">Result</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {history.map((game, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{game.type}</TableCell>
            <TableCell>
              <div>
                <div>
                  <span className="w-3 h-3 bg-slate-200 mr-3 inline-block"></span>
                  <p className="inline-block text-base tracking-wide font-medium">
                    {game.players.player1}
                  </p>
                </div>
                <span className="h-3 w-3 bg-stone-500 mr-3 inline-block"></span>
                <p className="inline-block text-base tracking-wide font-medium">
                  {game.players.player2}
                </p>
              </div>
            </TableCell>
            <TableCell className="w-fit">
              <div className="flex justify-center items-center">
                <div>
                  <p>1</p>
                  <p>0</p>
                </div>
                <div className="px-2">
                  <FaSquarePlus className="text-green-500 w-5 h-5" />
                </div>
              </div>
            </TableCell>
            <TableCell>{game.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
