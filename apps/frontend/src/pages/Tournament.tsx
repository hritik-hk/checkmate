import Countdown from "react-countdown";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { Separator } from "@radix-ui/react-separator";
import { points, fixtureRow, roundInterface } from "@/interfaces/common";
import { getPointsTable, getFixture } from "@/api/tournament";
import { useParams } from "react-router-dom";
import { useSocket } from "@/hooks/socket";
import { TournamentEvent } from "@/utils/constant";

export default function Tournament() {
  const { tournamentId } = useParams();

  const { socket } = useSocket();

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

  const [pointsTable, setPointsTable] = useState<points[] | null>(null);
  const [fixture, setFixture] = useState<fixtureRow[] | null>(null);

  const [currRoundInfo, setcurrRoundInfo] = useState<roundInterface | null>(
    null
  );

  // Renderer callback with condition
  const renderer = ({ hours, minutes, seconds, completed }: any) => {
    if (completed) {
      return <span>00h00m00s</span>;
    } else {
      // Render a countdown
      return (
        <span>
          {hours < 10 ? `0${hours}` : hours}h
          {minutes < 10 ? `0${minutes}` : minutes}m
          {seconds < 10 ? `0${seconds}` : seconds}s
        </span>
      );
    }
  };

  function handleRoundUpdate(currRoundInfo: any) {
    console.log("currRoundInfo", currRoundInfo);
    setcurrRoundInfo(currRoundInfo);

    console.log("end>now", Number(currRoundInfo.endTime) > Date.now());
  }

  useEffect(() => {
    if (!socket) return;
    if (!tournamentId) return;

    socket.emit(TournamentEvent.JOIN_TOURNAMENT, tournamentId);
    socket.on(TournamentEvent.ROUND_UPDATE, handleRoundUpdate);

    const fetchFixture = async () => {
      const data = await getFixture(tournamentId);
      setFixture(data);
    };

    const fetchPointsTable = async () => {
      const data = await getPointsTable(tournamentId);
      let pos = 1;
      for (let i = 1; i < data.length; i++) {
        if (data[i - 1].point < data[i].point) {
          pos++;
        }
        data[i].position = pos;
      }
      setPointsTable(data);
    };

    fetchPointsTable();
    fetchFixture();

    return () => {
      socket.off(TournamentEvent.ROUND_UPDATE, handleRoundUpdate);
    };
  }, []);

  return (
    <>
      <Navbar />
      {fixture && pointsTable && (
        <div>
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
                      {pointsTable.map((player, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-bold">
                            {player.position}
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
                  {fixture.map((round) => {
                    return (
                      <div>
                        <h3 className="text-2xl font-semibold tracking-wide font-mono">
                          ROUND {round.round}
                        </h3>
                        <Separator className="mb-2 text-slate-200 h-1" />
                        {round.games.map((game) => {
                          return (
                            <div>
                              <div className="flex">
                                <p className="w-2/5">{game.player1_username}</p>
                                <p className="w-1/5">VS</p>
                                <p className="w-2/5">{game.player2_username}</p>
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
            {currRoundInfo && (
              <div className="text-3xl">
                {Date.now() < Number(currRoundInfo.startTime) ? (
                  <div>
                    <div>{`Round: ${currRoundInfo.roundNumber} starts in`}</div>
                    <Countdown
                      date={Number(currRoundInfo.startTime)}
                      renderer={renderer}
                    />
                  </div>
                ) : (
                  <div>
                    <div>{`Round: ${currRoundInfo.roundNumber} ends in`}</div>
                    <Countdown
                      date={Number(currRoundInfo.endTime)}
                      renderer={renderer}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
