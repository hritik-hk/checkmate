import CountDown from "@/components/CountDown";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Navbar from "@/components/Navbar";
import { useEffect, useState, useRef } from "react";
import { Separator } from "@radix-ui/react-separator";
import { points, fixtureRow, roundInterface } from "@/interfaces/common";
import { getPointsTable, getFixture } from "@/api/tournament";
import { useParams } from "react-router-dom";
import { useSocket } from "@/hooks/socket";
import { TournamentEvent } from "@/utils/constant";

export default function Tournament() {
  const { tournamentId } = useParams();

  const { socket } = useSocket();

  const [pointsTable, setPointsTable] = useState<points[] | null>(null);
  const [fixture, setFixture] = useState<fixtureRow[] | null>(null);

  const [currRoundInfo, setcurrRoundInfo] = useState<roundInterface | null>(
    null
  );

  const [countdown, setCountdown] = useState<number | null>(null);
  const [status, setStatus] = useState<string>("start");

  const countdownId = useRef<NodeJS.Timeout | null>(null);

  const resetCountdown = () => {
    if (countdownId.current) {
      clearInterval(countdownId.current);
      countdownId.current = null;
    }

    if (currRoundInfo) {
      if (Number(currRoundInfo.startTime) > Date.now()) {
        setCountdown(
          Math.floor((Number(currRoundInfo.startTime) - Date.now()) / 1000)
        );
        setStatus("start");
      } else {
        setCountdown(
          Math.floor((Number(currRoundInfo.endTime) - Date.now()) / 1000)
        );
        setStatus("end");
      }

      startCountdown();
    }
  };

  const startCountdown = () => {
    if (!countdownId.current) {
      countdownId.current = setInterval(() => {
        setCountdown((prevSeconds) => {
          if (prevSeconds === null) return null;
          else if (prevSeconds <= 1) {
            setStatus("end");
            return 0;
          } else return prevSeconds - 1;
        });
      }, 1000); // Update every second
    }
  };

  function handleRoundUpdate(currRoundInfo: any) {
    console.log("currRoundInfo", currRoundInfo);
    setcurrRoundInfo(currRoundInfo);

    console.log("end>now", Number(currRoundInfo.endTime) > Date.now());
  }

  function handleTournamentEnd() {
    setStatus("completed");
    setcurrRoundInfo(null); // to trigger points table update
  }

  //setup socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on(TournamentEvent.ROUND_UPDATE, handleRoundUpdate);
    socket.on(TournamentEvent.END_TOURNAMENT, handleTournamentEnd);
    socket.emit(TournamentEvent.JOIN_TOURNAMENT, tournamentId);

    return () => {
      socket.off(TournamentEvent.ROUND_UPDATE, handleRoundUpdate);
      socket.off(TournamentEvent.END_TOURNAMENT, handleTournamentEnd);
    };
  }, []);

  // fetch points table and tournament fixture
  useEffect(() => {
    if (!tournamentId) return;

    const fetchFixture = async () => {
      const data = await getFixture(tournamentId);
      setFixture(data);
    };

    const fetchPointsTable = async () => {
      const data = await getPointsTable(tournamentId);
      let pos = 1;
      for (let i = 1; i < data.length; i++) {
        if (data[i - 1].point > data[i].point) {
          pos++;
        }
        data[i].position = pos;
      }

      setPointsTable(data);
    };

    fetchPointsTable();
    fetchFixture();
  }, [currRoundInfo]);

  useEffect(() => {
    resetCountdown();
  }, [status, currRoundInfo]);

  return (
    <>
      <Navbar />
      {fixture && pointsTable && (
        <div>
          <div className="px-48 bg-stone-700 h-3/4">
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

          <div className="p-5 flex justify-center items-center">
            {currRoundInfo && status !== "completed" && (
              <div className="text-3xl">
                {status === "start" ? (
                  <div>{`Round: ${currRoundInfo.roundNumber} starts in `}</div>
                ) : (
                  <div>{`Round: ${currRoundInfo.roundNumber} ends in `}</div>
                )}
                {countdown && <CountDown seconds={countdown} />}
              </div>
            )}
            {status === "completed" && (
              <div className="text-3xl font-medium">TOURNAMENT ENDED</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
