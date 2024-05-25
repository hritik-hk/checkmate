import { PriorityQueue, ICompare } from "@datastructures-js/priority-queue";
import { IRequest, IUser } from "../interfaces/common.js";
import db from "../configs/database.js";
import { emitSocketEvent } from "../index.js";
import { GameEvent } from "../constants.js";
import { GameType, GameStatus } from "@prisma/client";
import { gamesHandler } from "../index.js";

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
  private _activeWaiting: Set<string>; // users who have not cancelled play request

  constructor() {
    this._blitzQueue = new PriorityQueue<IUser>(compareBlitz);
    this._rapidQueue = new PriorityQueue<IUser>(compareRapid);
    this._activeWaiting = new Set<string>();
  }

  private async handleAssignBlitzGame(req: IRequest) {
    while (this._blitzQueue.size() > 1) {
      const whitePlayer = this._blitzQueue.dequeue();
      const blackPlayer = this._blitzQueue.dequeue();

      // deleting players who have cancelled their game request
      if (
        !this._activeWaiting.has(whitePlayer.id) &&
        !this._activeWaiting.has(blackPlayer.id)
      ) {
        continue;
      } else if (!this._activeWaiting.has(whitePlayer.id)) {
        this._blitzQueue.enqueue(blackPlayer);
        continue;
      } else if (!this._activeWaiting.has(blackPlayer.id)) {
        this._blitzQueue.enqueue(whitePlayer);
        continue;
      }

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

        //add to active games
        gamesHandler.addGame(newGame);

        // emit start_game socket event to both players
        emitSocketEvent(newGame.blackPlayerId, GameEvent.INIT_GAME, newGame.id);

        emitSocketEvent(newGame.whitePlayerId, GameEvent.INIT_GAME, newGame.id);

        //removing players from active waiting
        this._activeWaiting.delete(blackPlayer.id);
        this._activeWaiting.delete(whitePlayer.id);
      } catch (err) {
        console.log(err);

        //removing players from active waiting
        this._activeWaiting.delete(blackPlayer.id);
        this._activeWaiting.delete(whitePlayer.id);
      }
    }
  }

  private async handleAssignRapidGame(req: IRequest) {
    while (this._rapidQueue.size() > 1) {
      const whitePlayer = this._rapidQueue.dequeue();
      const blackPlayer = this._rapidQueue.dequeue();

      // deleting players who have cancelled their game request
      if (
        !this._activeWaiting.has(whitePlayer.id) &&
        !this._activeWaiting.has(blackPlayer.id)
      ) {
        continue;
      } else if (!this._activeWaiting.has(whitePlayer.id)) {
        this._rapidQueue.enqueue(blackPlayer);
        continue;
      } else if (!this._activeWaiting.has(blackPlayer.id)) {
        this._rapidQueue.enqueue(whitePlayer);
        continue;
      }

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

        //add to active games
        gamesHandler.addGame(newGame);

        // emit start_game socket event to both players
        emitSocketEvent(newGame.blackPlayerId, GameEvent.INIT_GAME, newGame.id);

        emitSocketEvent(newGame.whitePlayerId, GameEvent.INIT_GAME, newGame.id);

        //removing players from active waiting
        this._activeWaiting.delete(blackPlayer.id);
        this._activeWaiting.delete(whitePlayer.id);
      } catch (err) {
        console.log(err);

        //removing players from active waiting
        this._activeWaiting.delete(blackPlayer.id);
        this._activeWaiting.delete(whitePlayer.id);
      }
    }
  }

  public cancelGameRequest(userId: string) {
    this._activeWaiting.delete(userId);
  }

  public async addPlayer(req: IRequest, user: IUser) {
    //handling multiple requests by same user
    if (this._activeWaiting.has(user.id)) {
      return;
    }

    // add to player, to active waiting
    this._activeWaiting.add(user.id);

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
