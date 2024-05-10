import { ITournamentGame } from "../interfaces/common.js";
import { GameEvent } from "../constants.js";
import { emitSocketEvent } from "../index.js";
import { gamesHandler } from "../index.js";

class tournamentManager {
  private remainingGames: Map<string, ITournamentGame[]>;
  private onGoingGames: Map<string, Map<string, ITournamentGame>>;
  private waitingList: Array<string>;

  constructor() {
    this.remainingGames = new Map<string, ITournamentGame[]>();
    this.onGoingGames = new Map<string, Map<string, ITournamentGame>>();
    this.waitingList = new Array<string>();
  }

  public async handleGameRequest(tournamentId: string, userId: string) {
    this.waitingList.push(userId);

    const rem = this.remainingGames.get(tournamentId);

    while (this.waitingList.length > 1) {
      for (let i = 0; i < this.waitingList.length; i++) {
        for (let j = i + 1; this.waitingList.length; j++) {
          const player1 = this.waitingList[i];
          const player2 = this.waitingList[j];

          const updatedRem = rem?.filter((game) => {
            if (
              (game.whitePlayerId === player1 &&
                game.blackPlayerId === player2) ||
              (game.whitePlayerId === player2 && game.blackPlayerId === player1)
            ) {
              this.onGoingGames.get(tournamentId)?.set(game.id, game);

              //create and add new tournament game
              gamesHandler.addGame(game);

              // emit new game created to the players
              emitSocketEvent(
                game.blackPlayerId,
                GameEvent.NEW_GAME_EVENT,
                game
              );

              emitSocketEvent(
                game.whitePlayerId,
                GameEvent.NEW_GAME_EVENT,
                game
              );

              return false;
            } else {
              return true;
            }
          });

          this.remainingGames.set(
            tournamentId,
            updatedRem as ITournamentGame[]
          );
        }
      }
    }
  }

  // add remaining games
  public addGamesInTournament(tournamentId: string, games: ITournamentGame[]) {
    this.remainingGames.set(tournamentId, games);
  }
}

const tournament = new tournamentManager();

export { tournament, tournamentManager };
