import { Chess } from "chess.js";
import { Square } from "chess.js";

//TO DO : make common interface exports from packages folder
export interface move {
  from: Square;
  to: Square;
  promotion?: string;
}

class GameState {
  private _gameState: Chess;
  private _whitePlayerId: string;
  private _blackPlayerId: string;

  constructor(whitePlayerId: string, blackPlayerId: string) {
    this._gameState = new Chess();
    this._whitePlayerId = whitePlayerId;
    this._blackPlayerId = blackPlayerId;
  }

  get gameState(): Chess {
    return this._gameState;
  }
  get whitePlayer(): string {
    return this._whitePlayerId;
  }
  get blackPlayer(): string {
    return this._blackPlayerId;
  }

  //validate and play move
  public makeMove(move: move, piece: string, playerId: string) {
    if (
      (piece[0] === "b" && playerId === this._blackPlayerId) ||
      (piece[0] === "w" && playerId === this._whitePlayerId)
    ) {
      const result = this._gameState.move(move);
      return result; // NULL return if move is invald
    } else {
      //trying to play opponents pieces
      return null;
    }
  }
}

// this will contain currently active games
const activeGames: Map<string, GameState> = new Map<string, GameState>();

export { GameState, activeGames };
