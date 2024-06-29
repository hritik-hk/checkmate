import Tournament from "./tournament.js";
import db from "../configs/database.js";

class tournamentManager {
  private _activeTournament: Map<string, Tournament>; //will contain currently active Tournaments

  constructor() {
    this._activeTournament = new Map<string, Tournament>();
  }

  public async addTournament(tournamentId: string) {
    try {
      const rounds = await db.round.findMany({
        where: { tournamentId: tournamentId },
        orderBy: {
          roundNumber: "asc",
        },
        select: {
          id: true,
          tournamentId: true,
          roundNumber: true,
          startTime: true,
          endTime: true,
          bye: true,
          roundGames: true,
        },
      });

      const newTournament = new Tournament(tournamentId, rounds);

      this._activeTournament.set(tournamentId, newTournament);
    } catch (err) {
      console.log("error adding to active tournament: ", err);
    }
  }

  public getTournament(tournamentId: string) {
    return this._activeTournament.get(tournamentId);
  }

  public removeTournament(tournamentId: string) {
    this._activeTournament.delete(tournamentId);
  }

  public getCurrRoundInfo(tournamentId: string) {
    const tournament = this._activeTournament.get(tournamentId);
    if (!tournament) {
      console.log("invalid tournament id");
      return;
    }
    return tournament.getCurrRoundInfo();
  }
}

export default tournamentManager;
