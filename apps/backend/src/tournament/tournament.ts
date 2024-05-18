import { IRound } from "../interfaces/common.js";
import { emitSocketEvent } from "../index.js";
import { TournamentEvent, GameEvent } from "../constants.js";
import { Queue } from "@datastructures-js/queue";
import { gamesHandler } from "../index.js";

class Tournament {
  private _tournamentId: string;
  private _rounds: Queue<IRound>;
  private _currRoundStart: NodeJS.Timeout | null = null;
  private _currRoundEnd: NodeJS.Timeout | null = null;

  constructor(tournamentId: string, roundData: IRound[]) {
    this._tournamentId = tournamentId;
    this._rounds = Queue.fromArray(roundData);

    this._currRoundStart = setTimeout(() => {
      //initiate all round games
      const roundGames = roundData[0]?.roundGames;

      roundGames?.forEach((game) => {
        //add to active games
        gamesHandler.addGame(game);
        // logic to emit start_game socket event to both players
        emitSocketEvent(game.blackPlayerId, GameEvent.INIT_GAME, game.id);
        emitSocketEvent(game.whitePlayerId, GameEvent.INIT_GAME, game.id);
      });
    }, roundData[0]?.startTime);

    this._currRoundEnd = setTimeout(() => {
      this._resetRoundEnd();
    }, roundData[0]?.endTime);
  }

  //reset currRoundStart
  private _resetRoundStart() {
    if (this._currRoundStart) {
      clearTimeout(this._currRoundStart);
    }

    const currRound = this._rounds.front();

    this._currRoundStart = setTimeout(() => {
      //initiate all round games
      const roundGames = currRound.roundGames;

      roundGames?.forEach((game) => {
        //add to active games
        gamesHandler.addGame(game);
        // logic to emit start_game socket event to both players
        emitSocketEvent(game.blackPlayerId, GameEvent.INIT_GAME, game.id);
        emitSocketEvent(game.whitePlayerId, GameEvent.INIT_GAME, game.id);
      });
    }, currRound?.startTime - Date.now());
  }

  //reset currRoundEnd
  private _resetRoundEnd() {
    if (this._currRoundEnd) {
      clearTimeout(this._currRoundEnd);
    }

    this._rounds.dequeue();

    this._resetRoundStart();

    //To Do: make updates in database

    const currRound = this._rounds.front();

    //send round updates
    const roundUpdate = {
      roundId: currRound?.id,
      roundNumber: currRound?.roundNumber,
      roundStart: currRound?.startTime,
      roundEnd: currRound?.endTime,
      roundGames: currRound?.roundGames,
    };
    emitSocketEvent(
      this._tournamentId,
      TournamentEvent.ROUND_UPDATE,
      roundUpdate
    );

    this._currRoundEnd = setTimeout(() => {
      this._resetRoundEnd();
    }, currRound?.endTime - Date.now());
  }

  public getCurrRoundInfo() {
    return this._rounds.front();
  }
}

export default Tournament;
