import { GameState } from "./game.js";
import { IGame, ITournamentGame } from "../interfaces/common.js";
import db from "../configs/database.js";

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

  public async getGameInfo(gameId: string) {
    const game = this.activeGames.get(gameId);

    const whitePlayer = await db.user.findFirst({
      where: {
        id: game?.whitePlayer,
      },
      select: {
        id: true,
        blitz_rating: true,
        rapid_rating: true,
        username: true,
      },
    });

    const blackPlayer = await db.user.findFirst({
      where: {
        id: game?.blackPlayer,
      },
      select: {
        id: true,
        blitz_rating: true,
        rapid_rating: true,
        username: true,
      },
    });

    const gameInfo = {
      gameId,
      boardStatus: game?.gameState.fen(),
      whitePlayer: whitePlayer,
      blackPlayer: blackPlayer,
      timeUsedByWhitePlayer: game?.getWhitePlayerTimeConsumed(),
      timeUsedByBlackPlayer: game?.getBlackPlayerTimeConsumed(),
      gameDuration: game?.gameDuration,
    };

    return gameInfo;
  }
}

export default gameManager;
