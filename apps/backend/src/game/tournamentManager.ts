import { IGame, IRequest } from "../interfaces/common.js";
import { emitSocketEvent } from "../socket/socket.js";
import { activeGames, GameState } from "./game.js";
import { GameEvent } from "../constants.js";

class tournamentManager {
  private remainingGames: Map<string, IGame[]>;
  private onGoingGames: Map<string, Map<string, IGame>>;
  private waitingList: Array<string>;

  constructor() {
    this.remainingGames = new Map<string, IGame[]>();
    this.onGoingGames = new Map<string, Map<string, IGame>>();
    this.waitingList = new Array<string>();
  }

  public async handleGameRequest(
    req: IRequest,
    tournamentId: string,
    userId: string
  ) {
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

              //create the new game
              const newGame = new GameState(
                game.whitePlayerId,
                game.blackPlayerId
              );

              //add to active games
              activeGames.set(game.id, newGame);

              // emit new game created to the players
              emitSocketEvent(
                req,
                game.blackPlayerId,
                GameEvent.NEW_GAME_EVENT,
                game
              );

              emitSocketEvent(
                req,
                game.whitePlayerId,
                GameEvent.NEW_GAME_EVENT,
                game
              );

              return false;
            } else {
              return true;
            }
          });

          this.remainingGames.set(tournamentId, updatedRem as IGame[]);
        }
      }
    }
  }

  // add remaining games
  public addGamesInTournament(tournamentId: string, games: IGame[]) {
    this.remainingGames.set(tournamentId, games);
  }
}

const tournament = new tournamentManager();

export { tournament, tournamentManager };
