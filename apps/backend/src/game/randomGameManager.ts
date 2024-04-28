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
            status: "IN_PROGRESS",
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
        emitSocketEvent(
          req,
          newGame.blackPlayerId,
          GameEvent.INIT_GAME,
          newGame.id
        );

        emitSocketEvent(
          req,
          newGame.whitePlayerId,
          GameEvent.INIT_GAME,
          newGame.id
        );
      } catch (err) {
        console.log(err);
      }
    }
  }

  public async addUser(req: IRequest, user: IUser) {
    //TO DO: handle multiple requests by same user ie. 
    // the user shouldn't be added to queue again if it's already in the queue
    this._userQueue.enqueue(user);
    await this.handleAssignGame(req);
  }
}

const randomGame = new randomGameManager();

export { randomGame, randomGameManager };
