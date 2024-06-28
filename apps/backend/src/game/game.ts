import { Chess } from "chess.js";
import { Square } from "chess.js";
import { checkPromotion } from "../utils/helpers.utils.js";
import { emitSocketEvent } from "../index.js";
import { GameEvent, GameCategory, FACTOR } from "../constants.js";
import db from "../configs/database.js";
import { GameResult, GameType, Status } from "@prisma/client";
import { calExpectedScore, calNewRating } from "../utils/helpers.utils.js";
import { gamesHandler } from "../index.js";

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
  private _gameType: GameType;
  private _gameCategory: string;
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
    gameDuration: number,
    gameType: GameType,
    gameCategory: string
  ) {
    this._gameId = gameId;
    this._gameState = new Chess();
    this._whitePlayerId = whitePlayerId;
    this._blackPlayerId = blackPlayerId;
    this._whitePlayerTime = 0;
    this._blackPlayerTime = 0;
    this._lastMoveTime = Date.now();
    this._moveCount = 0;
    this._gameType = gameType;
    this._gameCategory = gameCategory;
    this._gameAbortTimer = setTimeout(() => {
      const payload = {
        status: Status.COMPLETED,
        result: GameResult.ABANDONED,
        //the player who didnt any move in the beginning will loose
        winnerId:
          this._gameState.turn() === "b"
            ? this._whitePlayerId
            : this._blackPlayerId,
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
  private async _endGame({
    result,
    status,
    winnerId,
  }: {
    result: GameResult;
    status: Status;
    winnerId: string | null;
  }) {
    try {
      //TO DO: handle "DRAW"

      emitSocketEvent(this._gameId, GameEvent.END_GAME, {
        result,
        winnerId,
        gameCategory: this._gameCategory,
      });

      // Clear Gameover timer timeout
      //so that if the game ends by other than times up, this doesnt send another game over result
      if (this._gameOverTimer) {
        clearTimeout(this._gameOverTimer);
      }

      //updating game
      if (this._gameCategory === GameCategory.TOURNAMENT_GAME) {
        await db.tournamentGame.update({
          where: {
            id: this._gameId,
          },
          data: {
            result: result,
            status: status,
            winnerId: winnerId,
          },
        });
      } else {
        await db.game.update({
          where: {
            id: this._gameId,
          },
          data: {
            result: result,
            status: status,
            winnerId: winnerId,
          },
        });
      }

      // update user ratings
      const whitePlayer = await db.user.findFirst({
        where: {
          id: this._whitePlayerId,
        },
        select: {
          id: true,
          blitz_rating: true,
          rapid_rating: true,
        },
      });

      const blackPlayer = await db.user.findFirst({
        where: {
          id: this._blackPlayerId,
        },
        select: {
          id: true,
          blitz_rating: true,
          rapid_rating: true,
        },
      });

      if (blackPlayer === null || whitePlayer === null) return;

      const whitePlayerRating =
        this._gameType === GameType.BLITZ
          ? whitePlayer.blitz_rating
          : whitePlayer.rapid_rating;
      const blackPlayerRating =
        this._gameType === GameType.BLITZ
          ? blackPlayer.blitz_rating
          : blackPlayer.rapid_rating;

      //caculate expected score for white player
      const whiteExpected = calExpectedScore(
        whitePlayerRating,
        blackPlayerRating
      );
      const blackExpected = 1 - whiteExpected;

      //initialize for Draw
      let whiteActual = 0.5;
      let blackActual = 0.5;

      if (result !== GameResult.DRAW) {
        whiteActual = winnerId === whitePlayer.id ? 1 : 0;
        blackActual = winnerId === blackPlayer.id ? 1 : 0;
      }

      const whiteNewRating = calNewRating(
        whitePlayerRating,
        whiteActual,
        whiteExpected,
        FACTOR
      );
      const blackNewRating = calNewRating(
        blackPlayerRating,
        blackActual,
        blackExpected,
        FACTOR
      );

      //update players ratings
      //white player
      await db.user.update({
        where: {
          id: whitePlayer.id,
        },
        data: {
          blitz_rating:
            this._gameType === GameType.BLITZ
              ? whiteNewRating
              : whitePlayer.blitz_rating,
          rapid_rating:
            this._gameType === GameType.RAPID
              ? whiteNewRating
              : whitePlayer.rapid_rating,
        },
      });

      //black player
      await db.user.update({
        where: {
          id: blackPlayer.id,
        },
        data: {
          blitz_rating:
            this._gameType === GameType.BLITZ
              ? blackNewRating
              : blackPlayer.blitz_rating,
          rapid_rating:
            this._gameType === GameType.RAPID
              ? blackNewRating
              : blackPlayer.rapid_rating,
        },
      });

      // removing game from active games
      gamesHandler.removeGame(this._gameId);
    } catch (err) {
      console.log("error updating DB from game end", err);
    }
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
        result: GameResult.TIMES_UP,
        status: Status.COMPLETED,
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
        return null;
      }

      if (this._gameState.turn() === "b" && playerId !== this._blackPlayerId) {
        return null;
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
      if (this._moveCount >= 2) this._clearAbandonedTimer();

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
        const winner =
          this._gameState.turn() === "b"
            ? this._whitePlayerId //white won
            : this._blackPlayerId; // black won

        if (this._gameState.isCheckmate()) {
          const payload = {
            result: GameResult.CHECKMATE,
            status: Status.COMPLETED,
            winnerId: winner,
          };
          this._endGame(payload); // end the game
        } else if (this._gameState.isDraw()) {
          const payload = {
            result: GameResult.DRAW,
            status: Status.COMPLETED,
            winnerId: null,
          };
          this._endGame(payload); // end the game
        }
      }

      return result; // NULL return if move is invald
    } catch (error) {
      console.log("error playing move ", error);
      return null; // to undo on frontend
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
