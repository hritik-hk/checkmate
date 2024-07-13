import CountDown from "@/components/CountDown";
import Navbar from "@/components/Navbar";
import { useEffect, useState, useRef } from "react";
import { points, fixtureRow, roundInterface } from "@/interfaces/common";
import { getPointsTable, getFixture } from "@/api/tournament";
import { useParams } from "react-router-dom";
import { useSocket } from "@/hooks/socket";
import { TournamentEvent } from "@/utils/constant";
import PointsTable from "@/components/PointsTable";
import TournamentFixture from "@/components/TournamentFixture";
import TournamentCompactView from "@/components/TournamentCompactView";
import Spinner from "@/components/Spinner";

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

  if (!currRoundInfo && !fixture && !pointsTable) {
    return (
      <>
        <Navbar />
        <Spinner />
      </>
    );
  }

  return (
    <>
      <Navbar />
      {fixture && pointsTable && currRoundInfo && (
        <div className="bg-stone-700 min-h-screen">
          <div>
            <div className="px-48 h-3/4">
              <div className="hidden sm:grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
                {/* points table */}
                <div>
                  <h2 className="text-3xl font-semibold tracking-wide font-mono bg-stone-900 my-2 rounded-md p-3">
                    POINTS TABLE
                  </h2>
                  <PointsTable
                    pointsTable={pointsTable}
                    tournamentId={currRoundInfo.tournamentId}
                    roundId={currRoundInfo.id}
                    status={status}
                  />
                </div>
                {/* Tournament Fixture */}
                <div>
                  <h2 className="text-3xl font-semibold tracking-wide font-mono bg-stone-900 my-2 rounded-md p-3">
                    Tournament Fixture
                  </h2>
                  <TournamentFixture fixture={fixture} />
                </div>
              </div>
            </div>

            <div className="sm:hidden pt-5">
              <TournamentCompactView
                pointsTable={pointsTable}
                fixture={fixture}
                tournamentId={currRoundInfo.tournamentId}
                roundId={currRoundInfo.id}
                status={status}
              />
            </div>
          </div>

          <div className="py-1 sm:py-5 flex justify-center items-center">
            {currRoundInfo && status !== "completed" && (
              <div className="text-xl sm:text-3xl font-mono mt-10 bg-stone-900 py-4 px-2 sm:px-4 rounded-md">
                {status === "start" ? (
                  <span>{`Round-${currRoundInfo.roundNumber} starts in: `}</span>
                ) : (
                  <span>{`Round-${currRoundInfo.roundNumber} ends in: `}</span>
                )}
                {countdown && (
                  <span className="bg-red-700 p-2 rounded-lg">
                    <CountDown seconds={countdown} />
                  </span>
                )}
              </div>
            )}
            {status === "completed" && (
              <div className="mt-4 sm:mt-7 text-2xl sm:text-3xl font-medium bg-red-700 p-2 rounded-lg">
                TOURNAMENT ENDED
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
