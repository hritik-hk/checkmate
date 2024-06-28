import { IRound } from "../interfaces/common.js";
import { emitSocketEvent } from "../index.js";
import { TournamentEvent, GameEvent, GameCategory } from "../constants.js";
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
    const startDelay = Number(roundData[0]?.startTime) - Date.now();
    const endDelay = Number(roundData[0]?.endTime) - Date.now();

    this._currRoundStart = setTimeout(() => {
      //initiate all round games
      const roundGames = roundData[0]?.roundGames;

      roundGames?.forEach((game) => {
        //add to active games
        gamesHandler.addGame(game, GameCategory.TOURNAMENT_GAME);
        // logic to emit start_game socket event to both players
        emitSocketEvent(game.blackPlayerId, GameEvent.INIT_GAME, game.id);
        emitSocketEvent(game.whitePlayerId, GameEvent.INIT_GAME, game.id);
      });
    }, startDelay);

    this._currRoundEnd = setTimeout(() => {
      this._resetRoundEnd();
    }, endDelay);
  }

  //reset currRoundStart
  private _resetRoundStart() {
    if (this._currRoundStart) {
      clearTimeout(this._currRoundStart);
    }

    const currRound = this._rounds.front();
    const delay = Number(currRound?.startTime) - Date.now();

    this._currRoundStart = setTimeout(() => {
      //initiate all round games
      const roundGames = currRound.roundGames;

      roundGames?.forEach((game) => {
        //add to active games
        gamesHandler.addGame(game, GameCategory.TOURNAMENT_GAME);
        // logic to emit start_game socket event to both players
        emitSocketEvent(game.blackPlayerId, GameEvent.INIT_GAME, game.id);
        emitSocketEvent(game.whitePlayerId, GameEvent.INIT_GAME, game.id);
      });
    }, delay);
  }

  //reset currRoundEnd
  private _resetRoundEnd() {
    if (this._currRoundEnd) {
      clearTimeout(this._currRoundEnd);
    }

    this._rounds.dequeue();

    this._resetRoundStart();

    //To-Do: make updates in database
    // To-DO: remove from active tournaments when tournament Ends

    const currRound = this._rounds.front();
    const delay = Number(currRound?.endTime) - Date.now();

    //send round updates
    emitSocketEvent(
      this._tournamentId,
      TournamentEvent.ROUND_UPDATE,
      currRound
    );

    this._currRoundEnd = setTimeout(() => {
      this._resetRoundEnd();
    }, delay);
  }

  public getCurrRoundInfo() {
    console.log(this._rounds);
    return this._rounds.front();
  }
}

export default Tournament;
