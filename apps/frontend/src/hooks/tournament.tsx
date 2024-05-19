import { useContext } from "react";
import { TournamentContext } from "@/context/TournamentContext";

export const useTournament = () => {
  const state = useContext(TournamentContext);
  if (!state) {
    throw new Error("tournament state is undefined");
  }

  return state;
};
