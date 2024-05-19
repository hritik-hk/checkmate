import Tournament from "./tournament.js";
import { IGame, ITournament, ITournamentGame } from "../interfaces/common.js";

class tournamentManager {
  private _activeTournament: Map<string, Tournament>; //will contain currently active Tournaments

  constructor() {
    this._activeTournament = new Map<string, Tournament>();
  }

  public async addTournament(tournamentId: string) {

    return;
   
    //create new tournament
    //const newTournament = new Tournament(tournament.id, tournament.roundData);
    //this._activeTournament.set(tournament.id, newTournament);
  }

  public getGame(tournamentId: string) {
    return this._activeTournament.get(tournamentId);
  }

  public async getTournamentIdInfo(tournamentId: string) {
    const tournament = this._activeTournament.get(tournamentId);

    const tournamentInfo = {
      tournamentId,
      pointsTable: [],
      fixture: [],
      currRound: {
        start: tournament?.getCurrRoundInfo().startTime,
        end: tournament?.getCurrRoundInfo().endTime,
      },
    };

    return tournamentInfo;
  }
}

export default tournamentManager;
