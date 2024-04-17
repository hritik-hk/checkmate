import _ from "lodash";
import { Chess } from "chess.js";
import { moveType } from "../interfaces/common";

export const getUrl = (path: string): string => {
  const baseUri = import.meta.env.VITE_SERVER_URI;
  return `${baseUri}/${path}`;
};

export function makeAMove(
  moveMade: moveType,
  gameState: Chess,
  setGameState: React.Dispatch<React.SetStateAction<Chess>>
) {
  try {
    const gameCopy = _.cloneDeep(gameState);
    const result = gameCopy.move(moveMade);

    setGameState(gameCopy);

    return result; // null if the move was illegal, the move object if the move was legal
  } catch (error) {
    console.log("error while updating move from server", error);
  }
}
