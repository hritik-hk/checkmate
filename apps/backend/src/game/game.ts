import { Chess } from "chess.js";
import { Square } from "chess.js";
import { checkPromotion } from "../utils/helpers.utils.js";

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
  private _timer: NodeJS.Timeout; // to handle auto-abort due to  abandonment using setTimeOut
  private _whitePlayerTime: number; // time used up by white player
  private _blackPlayerTime: number; // time used up by black player
  private _lastMoveTime: number; // for calculating used up time and to maintain time remaining
  private _moveCount: number; // for clearing auto-abort timout

  constructor(whitePlayerId: string, blackPlayerId: string) {
    this._gameState = new Chess();
    this._whitePlayerId = whitePlayerId;
    this._blackPlayerId = blackPlayerId;
    this._whitePlayerTime = 0;
    this._blackPlayerTime = 0;
    this._lastMoveTime = Date.now();
    this._moveCount = 0;
    this._timer = setTimeout(() => {
      console.log("logic to abort game to abandonment");
    }, 60 * 1000);
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
  public makeMove(move: move, playerId: string) {
    try {
      //check if player is trying to move opponent's chess pieces
      if (this._gameState.turn() === "w" && playerId !== this._whitePlayerId) {
        return;
      }

      if (this._gameState.turn() === "b" && playerId !== this._blackPlayerId) {
        return;
      }

      const moveTimestamp = Date.now(); // to update _lastMoveTime
      let result: any = null; // to store update game result

      // play the move
      if (checkPromotion(this._gameState, move.from, move.to)) {
        result = this._gameState.move({
          from: move.from,
          to: move.to,
          promotion: "q", // promote to queen by default for NOW!!
        });
      } else {
        result = this._gameState.move({
          from: move.from,
          to: move.to,
        });
      }

      // update the time used by the player
      // as the _gameState is updated, using reverse logic
      if (this._gameState.turn() === "b") {
        this._whitePlayerTime =
          this._whitePlayerTime + (moveTimestamp - this._lastMoveTime);
      }

      if (this._gameState.turn() === "w") {
        this._blackPlayerTime =
          this._blackPlayerTime + (moveTimestamp - this._lastMoveTime);
      }

      this._lastMoveTime = moveTimestamp;

      if (this._gameState.isGameOver()) {
        const gameOverResult = this._gameState.isDraw()
          ? "DRAW"
          : this._gameState.turn() === "b"
            ? this._whitePlayerId
            : this._blackPlayerId;

        console.log(gameOverResult, "handle logic to end game");
      }

      return result; // NULL return if move is invald
    } catch (error) {
      console.log("error playing move ", error);
    }
  }

  public getWhitePlayerTimeConsumed() {
    if (this._gameState.turn() === "w") {
      return this._whitePlayerTime + (Date.now() - this._lastMoveTime);
    }
    return this._whitePlayerTime;
  }

  public getBlackPlayerTimeConsumed() {
    if (this._gameState.turn() === "b") {
      return this._blackPlayerTime + (Date.now() - this._lastMoveTime);
    }
    return this._blackPlayerTime;
  }
}

export { GameState };
