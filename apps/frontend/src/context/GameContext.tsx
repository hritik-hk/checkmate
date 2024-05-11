import { createContext, useState, ReactNode } from "react";
import { GameContextInterface, gameInfoInterface } from "@/interfaces/common";
import { Chess } from "chess.js";

const GameContext = createContext<GameContextInterface | null>(null);

const GameContextProvider = ({ children }: { children?: ReactNode }) => {
  const [gameState, setGameState] = useState<Chess | null>(null);
  const [currGameInfo, setCurrGameInfo] = useState<gameInfoInterface | null>(
    null
  );
  const [myCountDown, setMyCountDown] = useState<number | null>(null);
  const [opponentCountDown, setOpponentCountDown] = useState<number | null>(
    null
  );

  return (
    <GameContext.Provider
      value={{
        currGameInfo,
        setCurrGameInfo,
        gameState,
        setGameState,
        myCountDown,
        setMyCountDown,
        opponentCountDown,
        setOpponentCountDown,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export { GameContext, GameContextProvider };
