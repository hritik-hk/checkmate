import { useContext } from "react";
import { GameContext } from "../context/GameContext";

export const useGame = () => {
  const state = useContext(GameContext);
  if (!state) {
    throw new Error("game state is undefined");
  }

  return state;
};
