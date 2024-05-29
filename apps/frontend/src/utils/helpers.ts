import _ from "lodash";
import { Chess, Square } from "chess.js";

export const getUrl = (path: string): string => {
  const baseUri = import.meta.env.VITE_SERVER_URI;
  return `${baseUri}/${path}`;
};

// for checking if pawn could be promoted
export const checkPromotion = (chess: Chess, from: Square, to: Square) => {
  if (!from) {
    return false;
  }

  const piece = chess.get(from);

  if (piece?.type !== "p") {
    return false;
  }

  if (piece.color !== chess.turn()) {
    return false;
  }

  if (!["1", "8"].some((it) => to.endsWith(it))) {
    return false;
  }

  return chess
    .moves({ square: from, verbose: true })
    .map((it) => it.to)
    .includes(to);
};
