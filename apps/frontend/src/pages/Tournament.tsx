import Countdown from "react-countdown";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { count } from "console";

const points = [
  {
    username: "hritik",
    points: "5.5",
    rating: "1200",
  },
  {
    username: "sara",
    points: "2.5",
    rating: "1200",
  },
  {
    username: "nikki",
    points: "3.5",
    rating: "1200",
  },
  {
    username: "daksh",
    points: "1.5",
    rating: "1200",
  },
  {
    username: "sarthak",
    points: "2.5",
    rating: "1200",
  },
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
      handleStart();
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
      <div>
        <Table>
          <TableCaption>POINTS TABLE</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">USERNAME</TableHead>
              <TableHead>POINTS</TableHead>
              <TableHead>RATING</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {points.map((point) => (
              <TableRow key={point.username}>
                <TableCell className="font-medium">{point.username}</TableCell>
                <TableCell>{point.points}</TableCell>
                <TableCell>{point.rating}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
