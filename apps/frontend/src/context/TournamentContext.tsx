import { createContext, useState, ReactNode } from "react";
import {
  TournamentContextInterface,
  roundInterface,
  fixtureRow,
  points,
} from "@/interfaces/common";

const TournamentContext = createContext<TournamentContextInterface | null>(
  null
);

const TournamentContextProvider = ({ children }: { children?: ReactNode }) => {
  const [currRoundInfo, setCurrRoundInfo] = useState<roundInterface | null>(
    null
  );
  const [pointsTable, setPointsTable] = useState<points[] | null>(null);
  const [fixture, setFixture] = useState<fixtureRow[] | null>(null);

  return (
    <TournamentContext.Provider
      value={{
        currRoundInfo,
        setCurrRoundInfo,
        pointsTable,
        setPointsTable,
        fixture,
        setFixture,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export { TournamentContext, TournamentContextProvider };
