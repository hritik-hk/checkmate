import { Chess } from "chess.js";
import { Square } from "chess.js";
import { checkPromotion } from "../utils/helpers.utils.js";
import { emitSocketEvent } from "../index.js";
import { GameEvent } from "../constants.js";

//TO DO : make common interface exports from packages folder
export interface move {
  from: Square;
  to: Square;
  promotion?: string;
}

class GameState {
  private _gameId: string;
  private _gameState: Chess;
  private _whitePlayerId: string;
  private _blackPlayerId: string;
  private _gameAbortTimer: NodeJS.Timeout; // to handle auto-abort due to  abandonment using setTimeOut
  private _whitePlayerTime: number; // time used up by white player
  private _blackPlayerTime: number; // time used up by black player
  private _lastMoveTime: number; // for calculating used up time and to maintain time remaining
  private _moveCount: number; // for clearing auto-abort timout
  private _gameDuration: number;
  private _gameOverTimer: NodeJS.Timeout | null; // to handle game over due to times up

  constructor(
    gameId: string,
    whitePlayerId: string,
    blackPlayerId: string,
    gameDuration: number
  ) {
    this._gameId = gameId;
    this._gameState = new Chess();
    this._whitePlayerId = whitePlayerId;
    this._blackPlayerId = blackPlayerId;
    this._whitePlayerTime = 0;
    this._blackPlayerTime = 0;
    this._lastMoveTime = Date.now();
    this._moveCount = 0;
    this._gameAbortTimer = setTimeout(() => {
      const payload = {
        isAbandoned: true,
        isCheckmate: false,
        isDraw: false,
        isTimesUp: false,
        winnerId: "ABANDONED",
      };

      this._endGame(payload); // end the game
    }, 60 * 1000);
    this._gameDuration = gameDuration;
    this._gameOverTimer = null;
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
  get gameDuration(): number {
    return this._gameDuration;
  }

  //End game
  // To Do: handle game over by  times Up
  private _endGame(payload: any) {
    emitSocketEvent(this._gameId, GameEvent.END_GAME, payload);
  }

  private _clearAbandonedTimer() {
    if (this._gameAbortTimer) clearTimeout(this._gameAbortTimer);
  }

  private _resetGameOverTimer() {
    if (this._gameOverTimer) {
      clearTimeout(this._gameOverTimer);
    }
    const turn = this._gameState.turn();
    const timeLeft =
      this._gameDuration -
      (turn === "w" ? this._whitePlayerTime : this._blackPlayerTime);

    this._gameOverTimer = setTimeout(() => {
      const payload = {
        isAbandoned: false,
        isCheckmate: false,
        isDraw: false,
        isTimesUp: true,
        winnerId: turn === "b" ? this._whitePlayerId : this._blackPlayerId,
      };
      this._endGame(payload);
    }, timeLeft);
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

      this._moveCount++;
      //clear game abandoned timer
      if (this._moveCount > 2) this._clearAbandonedTimer();

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
      this._resetGameOverTimer();

      if (this._gameState.isGameOver()) {
        const gameOverResult =
          this._gameState.turn() === "b"
            ? this._blackPlayerId //white won
            : this._whitePlayerId; // black won

        const payload = {
          isAbandoned: false,
          isCheckmate: this._gameState.isCheckmate(),
          isDraw: this._gameState.isDraw(),
          isTimesUp: false,
          winnerId: gameOverResult,
        };

        this._endGame(payload); // end the game
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
