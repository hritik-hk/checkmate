import Countdown from "react-countdown";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FileTextIcon } from "@radix-ui/react-icons";
import { Separator } from "@radix-ui/react-separator";

const points = [
  {
    position: "#1",
    username: "hritik",
    points: "5.5",
    rating: "1200",
  },
  {
    position: "#1",
    username: "sara",
    points: "5.5",
    rating: "1200",
  },
  {
    position: "#2",
    username: "nikki",
    points: "3.5",
    rating: "1200",
  },
  {
    position: "#3",
    username: "daksh",
    points: "2.5",
    rating: "1200",
  },
  {
    position: "#4",
    username: "sarthak",
    points: "2.5",
    rating: "1200",
  },
];

const fixture = [
  [
    {
      player1: "sara",
      player2: "daksh",
    },
    {
      player1: "nikki",
      player2: "sarthak",
    },
    {
      player1: "hritik",
      player2: "BYE",
    },
  ],
  [
    {
      player1: "daksh",
      player2: "nikki",
    },
    {
      player1: "sarthak",
      player2: "hritik",
    },
    {
      player1: "sara",
      player2: "BYE",
    },
  ],
  [
    {
      player1: "nikki",
      player2: "sara",
    },
    {
      player1: "hritik",
      player2: "daksh",
    },
    {
      player1: "nikki",
      player2: "BYE",
    },
  ],
  [
    {
      player1: "hritik",
      player2: "nikki",
    },
    {
      player1: "sarthak",
      player2: "sara",
    },
    {
      player1: "daksh",
      player2: "BYE",
    },
  ],
];

export default function Tournament() {
  const roundData = [
    {
      roundNumber: 1,
      isRoundComplete: false,
      startTime: Date.now() + 12000,
      endTime: Date.now() + 360000 + 120000,
      roundGames: [
        {
          gameId: "111111",
          whitePlayerId: "white111",
          blackPlayerId: "black111",
        },
        {
          gameId: "222222",
          whitePlayerId: "white222",
          blackPlayerId: "black222",
        },
      ],
    },
    {
      roundNumber: 2,
      isRoundComplete: false,
      startTime: Date.now() + 360000 + 120000,
      endTime: Date.now() + 2 * (360000 + 120000),
      roundGames: [
        {
          gameId: "333333",
          whitePlayerId: "white333",
          blackPlayerId: "black333",
        },
        {
          gameId: "444444",
          whitePlayerId: "white444",
          blackPlayerId: "black444",
        },
      ],
    },
  ];

  const navigate = useNavigate();

  const [currRound, setCurrRound] = useState<(typeof roundData)[0] | null>(
    null
  );

  const [start, setStart] = useState<boolean>(true);

  const handleActiveRound = () => {
    const activeRound = roundData.find(
      (round) => round.isRoundComplete === false
    );

    if (activeRound) {
      setCurrRound(activeRound);
    }
  };

  const handleStart = () => {
    setStart((start) => !start);
  };

  // Renderer callback with condition
  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      //navigate("/toru");
      return <span>hello</span>;
    } else {
      // Render a countdown
      return (
        <span>
          {hours}h{minutes}m{seconds}s
        </span>
      );
    }
  };

  useEffect(() => {
    handleActiveRound();
  }, []);

  return (
    <>
      <Navbar />
      <div className="px-48 bg-stone-700">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
          <div>
            {/* points table */}

            <div>
              <h2 className="text-3xl font-semibold tracking-wide font-mono bg-stone-900 my-2 rounded-md p-3">
                POINTS TABLE
              </h2>
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
                  {points.map((player, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-bold">
                        {player.position}
                      </TableCell>
                      <TableCell>{player.username}</TableCell>
                      <TableCell>{player.points}</TableCell>
                      <TableCell>{player.rating}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* ongoing games in tournament */}
            <div>
              <h2 className="text-2xl font-semibold tracking-wide font-mono bg-stone-900 mt-5 mb-3 rounded-md p-3">
                Ongoing Tournament Games
              </h2>
              <div className="min-h-36 bg-stone-800">
                <p className="text-xl py-4">No ongoing games...</p>
              </div>
            </div>
          </div>

          {/* Tournament Fixture */}
          <div>
            <h2 className="text-3xl font-semibold tracking-wide font-mono bg-stone-900 my-2 rounded-md p-3">
              Tournament Fixture
            </h2>
            <div className="bg-stone-800 p-4 rounded-md">
              {fixture.map((round, ind) => {
                return (
                  <div>
                    <h3 className="text-2xl font-semibold tracking-wide font-mono">
                      ROUND {ind + 1}
                    </h3>
                    <Separator className="mb-2 text-slate-200 h-1" />
                    {round.map((game) => {
                      return (
                        <div>
                          <div className="flex">
                            <p className="w-2/5">{game.player1}</p>
                            <p className="w-1/5">VS</p>
                            <p className="w-2/5">{game.player2}</p>
                          </div>
                          <Separator className="mb-2" />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5">
        {currRound && (
          <div className="text-3xl">
            {start ? (
              <div>
                <div>{`Round: ${currRound.roundNumber} starts in`}</div>
                <Countdown date={currRound.startTime} renderer={renderer} />
              </div>
            ) : (
              <div>
                <div>{`Round: ${currRound.roundNumber} ends in`}</div>
                <Countdown date={currRound.endTime} renderer={renderer} />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
