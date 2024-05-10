import { PriorityQueue, ICompare } from "@datastructures-js/priority-queue";
import { IRequest, IUser } from "../interfaces/common.js";
import db from "../configs/database.js";
import { emitSocketEvent } from "../index.js";
import { GameState } from "./game.js";
import { GameEvent } from "../constants.js";
import { activeGames } from "../index.js";
import { GameType, GameStatus } from "@prisma/client";

const compareBlitz: ICompare<IUser> = (user1: IUser, user2: IUser) => {
  // with highest rating
  return user1.blitz_rating > user2.blitz_rating ? -1 : 1;
};

const compareRapid: ICompare<IUser> = (user1: IUser, user2: IUser) => {
  // with highest rating
  return user1.rapid_rating > user2.rapid_rating ? -1 : 1;
};

class randomGameManager {
  private _blitzQueue: PriorityQueue<IUser>; // 5min games
  private _rapidQueue: PriorityQueue<IUser>; // 10min games

  constructor() {
    this._blitzQueue = new PriorityQueue<IUser>(compareBlitz);
    this._rapidQueue = new PriorityQueue<IUser>(compareRapid);
  }

  private async handleAssignBlitzGame(req: IRequest) {
    while (this._blitzQueue.size() > 1) {
      const whitePlayer = this._blitzQueue.dequeue();
      const blackPlayer = this._blitzQueue.dequeue();

      //create new game
      try {
        const newGame = await db.game.create({
          data: {
            whitePlayerId: whitePlayer.id,
            blackPlayerId: blackPlayer.id,
            status: GameStatus.IN_PROGRESS,
            gameType: req.body.gameType,
            gameDuration: req.body.gameDuration,
          },
        });

        //create the new game
        const game = new GameState(
          newGame.whitePlayerId,
          newGame.blackPlayerId
        );

        //add to active games
        activeGames.set(newGame.id, game);

        // emit start_game socket event to both players
        emitSocketEvent(newGame.blackPlayerId, GameEvent.INIT_GAME, newGame.id);

        emitSocketEvent(newGame.whitePlayerId, GameEvent.INIT_GAME, newGame.id);
      } catch (err) {
        console.log(err);
      }
    }
  }

  private async handleAssignRapidGame(req: IRequest) {
    while (this._rapidQueue.size() > 1) {
      const whitePlayer = this._rapidQueue.dequeue();
      const blackPlayer = this._rapidQueue.dequeue();

      //create new game
      try {
        const newGame = await db.game.create({
          data: {
            whitePlayerId: whitePlayer.id,
            blackPlayerId: blackPlayer.id,
            status: GameStatus.IN_PROGRESS,
            gameType: req.body.gameType,
            gameDuration: req.body.gameDuration,
          },
        });

        //create the new game
        const game = new GameState(
          newGame.whitePlayerId,
          newGame.blackPlayerId
        );

        //add to active games
        activeGames.set(newGame.id, game);

        // emit start_game socket event to both players
        emitSocketEvent(newGame.blackPlayerId, GameEvent.INIT_GAME, newGame.id);

        emitSocketEvent(newGame.whitePlayerId, GameEvent.INIT_GAME, newGame.id);
      } catch (err) {
        console.log(err);
      }
    }
  }

  public async addPlayer(req: IRequest, user: IUser) {
    //TO DO: handle multiple requests by same user ie.
    // the user shouldn't be added to queue again if it's already in the queue
    if (req.body.gameType === GameType.BLITZ) {
      this._blitzQueue.enqueue(user);
      await this.handleAssignBlitzGame(req);
    } else {
      this._rapidQueue.enqueue(user);
      await this.handleAssignRapidGame(req);
    }
  }
}

const randomGame = new randomGameManager();

export { randomGame, randomGameManager };
