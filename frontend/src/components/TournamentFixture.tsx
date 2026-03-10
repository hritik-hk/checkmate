import { Separator } from "@radix-ui/react-separator";
import { fixtureRow } from "@/interfaces/common";

export default function TournamentFixture({
  fixture,
}: {
  fixture: fixtureRow[];
}) {
  return (
    <>
      <div>
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
    </>
  );
}
