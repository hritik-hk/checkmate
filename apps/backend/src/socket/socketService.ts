import { Server } from "socket.io";
import { ISocket } from "../interfaces/common.js";
import cookie from "cookie";
import db from "../configs/database.js";
import jwt from "jsonwebtoken";
import { payload } from "../interfaces/common.js";
import {
  FriendEvent,
  GameEvent,
  SocketEvent,
  TournamentEvent,
} from "../constants.js";
import { gamesHandler, tournamentHandler } from "../index.js";
import { randomGame } from "../game/randomGameManager.js";
import gameManager from "../game/gameManager.js";

export default class SocketService {
  private _io: Server;

  constructor() {
    this._io = new Server({
      cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
      },
    });
    console.log("socket server started");
  }

  private mountGameReqEvent(socket: ISocket, io: Server) {
    socket.on(GameEvent.GAME_REQUEST, (opponentId, gameInfo) => {
      io.in(opponentId).emit(GameEvent.GAME_REQUEST, {
        requestedBy: socket.user?.id,
        gameInfo,
      });
    });
  }

  private mountInitGameEvent(socket: ISocket) {
    socket.on(GameEvent.INIT_GAME, (gameId: string) => {
      socket.join(gameId);
      socket.emit(GameEvent.START_GAME, gameId);
    });
  }

  private mountJoinGameEvent(socket: ISocket) {
    socket.on(GameEvent.JOIN_GAME, async (gameId: string) => {
      const gameInfo = await gamesHandler.getGameInfo(gameId);

      //check if the socket has already joined the room
      const alreadyJoined = socket.rooms.has(gameId);
      if (!alreadyJoined) {
        socket.join(gameId);
      }
      if (gameInfo) {
        socket.emit(GameEvent.JOIN_GAME, gameInfo);
      }
    });
  }

  private mountInitTournamentEvent(socket: ISocket) {
    socket.on(TournamentEvent.INIT_TOURNAMENT, (tournamentId: string) => {
      socket.join(tournamentId);
      socket.emit(TournamentEvent.START_TOURNAMENT, tournamentId);
    });
  }

  private mountJoinTournamentEvent(socket: ISocket) {
    socket.on(TournamentEvent.JOIN_TOURNAMENT, (tournamentId: string) => {
      const currRoundInfo = tournamentHandler.getCurrRoundInfo(tournamentId);
      socket.emit(TournamentEvent.ROUND_UPDATE, currRoundInfo);
    });
  }

  private mountMakeMoveEvent(socket: ISocket) {
    socket.on(GameEvent.MOVE_UPDATE_EVENT, (gameId: string, update: string) => {
      const moveUpdate = JSON.parse(update);

      //update the gameState by playing the move
      const currGame = gamesHandler.getGame(gameId);
      if (currGame) {
        const move = { from: moveUpdate.from, to: moveUpdate.to };
        const result = currGame.makeMove(move, socket?.user?.id as string);

        if (result) {
          socket
            .to(gameId)
            .emit(GameEvent.MOVE_UPDATE_EVENT, currGame.gameState.fen());
        }
      }
    });
  }

  private mountFriendRequestEvent(socket: ISocket) {
    socket.on(FriendEvent.FRIEND_REQUEST, (request) => {
      const { receiverId } = request;
      socket.to(receiverId).emit(FriendEvent.FRIEND_REQUEST, request);
    });
  }

  private mountCancelRandomGame(socket: ISocket) {
    socket.on(GameEvent.CANCEL_RANDOM, (userId) => {
      randomGame.cancelGameRequest(userId);
    });
  }

  public initializeSocketService() {
    const io = this._io;

    io.use(async (socket: ISocket, next) => {
      try {
        // parse the cookies from the handshake headers
        // make client side req with `withCredentials: true` to include cookies
        const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

        let token = cookies?.accessToken; // get the accessToken

        if (!token) {
          // TO DO : Make an api error handler
          // Token is required for the socket to work
          throw new Error("Un-authorized handshake. Token is missing");
        }

        const tokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
        const decodedToken = jwt.verify(token, tokenSecret) as payload; // decode the token

        const user = await db.user.findUnique({
          where: { id: decodedToken.userId },
          select: {
            id: true,
            email: true,
            username: true,
            blitz_rating: true,
            rapid_rating: true,
          },
        });

        // retrieve the user
        if (!user) {
          //To Do: make a custom error handler
          throw new Error("Un-authorized handshake. Token is invalid");
        }
        socket.user = user; // mount the user object to the socket
        socket.join(user.id); // join repective userId room
        console.log("User connected, userId: ", user.id);
        next();
      } catch (err) {
        //console.log(err);
        next(
          new Error("Something went wrong while connecting to websocket server")
        );
      }
    });

    io.on("connection", async (socket: ISocket) => {
      try {
        // Common events that needs to be mounted on the initialization
        this.mountMakeMoveEvent(socket);
        this.mountGameReqEvent(socket, io);
        this.mountInitGameEvent(socket);
        this.mountJoinGameEvent(socket);
        this.mountJoinTournamentEvent(socket);
        this.mountInitTournamentEvent(socket);
        this.mountFriendRequestEvent(socket);
        this.mountCancelRandomGame(socket);

        socket.on(SocketEvent.DISCONNECT_EVENT, () => {
          console.log("user disconnected 🚫. userId: " + socket.user?.id);
          if (socket.user?.id) {
            socket.leave(socket.user.id);
          }
        });
      } catch (error) {
        console.log(error);
        socket.emit(
          SocketEvent.SOCKET_ERROR_EVENT,
          error || "Something went wrong while connecting to socketIO"
        );
      }
    });
  }

  //getters
  get io(): Server {
    return this._io;
  }
}
