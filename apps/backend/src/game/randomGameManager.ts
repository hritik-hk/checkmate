import { PriorityQueue, ICompare } from "@datastructures-js/priority-queue";
import { IRequest, IUser } from "../interfaces/common.js";
import db from "../configs/database.js";
import { emitSocketEvent } from "../socket/socket.js";
import { activeGames, GameState } from "./game.js";
import { GameEvent } from "../constants.js";

const compareUsers: ICompare<IUser> = (user1: IUser, user2: IUser) => {
  // with highest rating
  return user1.rating > user2.rating ? -1 : 1;
};

class randomGameManager {
  private _userQueue: PriorityQueue<IUser>;

  constructor() {
    this._userQueue = new PriorityQueue<IUser>(compareUsers);
  }

  private async handleAssignGame(req: IRequest) {
    while (this._userQueue.size() > 1) {
      const whitePlayer = this._userQueue.dequeue();
      const blackPlayer = this._userQueue.dequeue();

      //create new game
      try {
        const newGame = await db.game.create({
          data: {
            whitePlayerId: whitePlayer.id,
            blackPlayerId: blackPlayer.id,
          },
        });

        //create the new game
        const game = new GameState(
          newGame.whitePlayerId,
          newGame.blackPlayerId
        );

        //add to active games
        activeGames.set(newGame.id, game);

        // emit new game created to the players
        emitSocketEvent(
          req,
          newGame.blackPlayerId,
          GameEvent.NEW_GAME_EVENT,
          newGame
        );

        emitSocketEvent(
          req,
          newGame.whitePlayerId,
          GameEvent.NEW_GAME_EVENT,
          newGame
        );
        
      } catch (err) {
        console.log(err);
      }
    }
  }

  public async addUser(req: IRequest, user: IUser) {
    this._userQueue.enqueue(user);
    await this.handleAssignGame(req);
  }
}

const randomGame = new randomGameManager();

export { randomGame, randomGameManager };
