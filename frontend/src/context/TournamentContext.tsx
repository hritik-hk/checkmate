import { createContext, useState, ReactNode } from "react";
import { TournamentContextInterface } from "@/interfaces/common";

const TournamentContext = createContext<TournamentContextInterface | null>(
  null
);

const TournamentContextProvider = ({ children }: { children?: ReactNode }) => {
  const [ongoingTournament, setOngoingTournament] = useState<string | null>(
    null
  );

  return (
    <TournamentContext.Provider
      value={{
        ongoingTournament,
        setOngoingTournament,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export { TournamentContext, TournamentContextProvider };
