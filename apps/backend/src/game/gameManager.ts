import { GameState } from "./game.js";
import { IGame, ITournamentGame } from "../interfaces/common.js";

class gameManager {
  private activeGames: Map<string, GameState>; //will contain currently active games

  constructor() {
    this.activeGames = new Map<string, GameState>();
  }

  public addGame(game: IGame | ITournamentGame) {
    //create the new game
    const newGame = new GameState(
      game.whitePlayerId,
      game.blackPlayerId,
      game.gameDuration
    );
    this.activeGames.set(game.id, newGame);
  }

  public getGame(gameId: string) {
    return this.activeGames.get(gameId);
  }

  public getGameInfo(gameId: string) {
    const game = this.activeGames.get(gameId);

    const gameInfo = {
      boardStatus: game?.gameState.fen(),
      timeUsedByWhitePlayer: game?.getWhitePlayerTimeConsumed,
      timeUsedByBlackPlayer: game?.getBlackPlayerTimeConsumed,
      gameDuration: game?.gameDuration,
    };

    return gameInfo;
  }
}

export default gameManager;
