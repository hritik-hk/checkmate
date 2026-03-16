import { PriorityQueue, ICompare } from "@datastructures-js/priority-queue";
import { IRequest, IUser } from "../interfaces/common.js";
import db from "../configs/database.js";
import { emitSocketEvent } from "../index.js";
import { GameCategory, GameEvent } from "../constants.js";
import { GameType, Status } from "@prisma/client";
import { gamesHandler } from "../index.js";

const compareBlitz: ICompare<IUser> = (a, b) =>
  a.blitz_rating > b.blitz_rating ? -1 : 1; // highest rating

const compareRapid: ICompare<IUser> = (a, b) =>
  a.rapid_rating > b.rapid_rating ? -1 : 1; // highest rating

class randomGameManager {
  private _queues: Record<GameType, PriorityQueue<IUser>>;
  private _activeWaiting: Set<string>; // players who have not cancelled their request.

  constructor() {
    this._queues = {
      [GameType.BLITZ]: new PriorityQueue<IUser>(compareBlitz),
      [GameType.RAPID]: new PriorityQueue<IUser>(compareRapid),
    };
    this._activeWaiting = new Set<string>();
  }

  private async handleAssignGame(req: IRequest, gameType: GameType) {
    const queue = this._queues[gameType];

    while (queue.size() > 1) {
      const player1 = queue.dequeue();
      if (!player1) continue; // ts fix

      const player2 = queue.dequeue();
      
      if (!player2) { // ts fix
        queue.enqueue(player1);
        continue;
      }

      const p1Active = this._activeWaiting.has(player1.id);
      const p2Active = this._activeWaiting.has(player2.id);

      // put back whichever active player lost their match due to the other cancelling
      if (!p1Active) {
        if (p2Active) queue.enqueue(player2);
        continue;
      }
      if (!p2Active) {
        queue.enqueue(player1);
        continue;
      }

      try {
        const newGame = await db.game.create({
          data: {
            whitePlayerId: player1.id,
            blackPlayerId: player2.id,
            status: Status.IN_PROGRESS,
            gameType: req.body.gameType,
            gameDuration: req.body.gameDuration,
          },
        });

        gamesHandler.addGame(newGame, GameCategory.NORMAL_GAME);

        emitSocketEvent(player1.id, GameEvent.INIT_GAME, newGame.id);
        emitSocketEvent(player2.id, GameEvent.INIT_GAME, newGame.id);
      } catch (err) {
        console.error("Failed to create game:", err);
      } finally {
        this._activeWaiting.delete(player1.id);
        this._activeWaiting.delete(player2.id);
      }
    }
  }

  public cancelGameRequest(userId: string) {
    this._activeWaiting.delete(userId);
  }

  public async addPlayer(req: IRequest, user: IUser) {
    if(!user) return;
    if (this._activeWaiting.has(user.id)) return;

    this._activeWaiting.add(user.id);

    const gameType = req.body.gameType as GameType;
    this._queues[gameType].enqueue(user);
    await this.handleAssignGame(req, gameType);
  }
}

const randomGame = new randomGameManager();

export { randomGame, randomGameManager };
