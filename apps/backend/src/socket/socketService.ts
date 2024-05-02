import { Server } from "socket.io";
import { ISocket } from "../interfaces/common.js";
import cookie from "cookie";
import db from "../configs/database.js";
import jwt from "jsonwebtoken";
import { payload } from "../interfaces/common.js";
import { GameEvent, SocketEvent } from "../constants.js";
import { activeGames } from "../index.js";

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
    socket.on(GameEvent.GAME_REQUEST, (opponentId) => {
      io.in(opponentId).emit(GameEvent.GAME_REQUEST, {
        requestedBy: socket.user?.id,
      });
    });
  }

  private mountInitGameEvent(socket: ISocket) {
    socket.on(GameEvent.INIT_GAME, (gameId: string) => {
      socket.join(gameId);
      socket.emit(GameEvent.START_GAME, gameId);
    });
  }

  private mountMakeMoveEvent(socket: ISocket, io: Server) {
    socket.on(GameEvent.MOVE_UPDATE_EVENT, (gameId: string, update: string) => {
      const moveUpdate = JSON.parse(update);

      //update the gameState by playing the move
      const currGame = activeGames.get(gameId);
      const move = { from: moveUpdate.from, to: moveUpdate.to };
      currGame?.makeMove(move, moveUpdate.piece, socket?.user?.id as string);

      io.in(gameId).emit(
        GameEvent.MOVE_UPDATE_EVENT,
        currGame?.gameState.fen()
      );
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
        console.log(err);
        next(
          new Error("Something went wrong while connecting to the socketio")
        );
      }
    });

    io.on("connection", async (socket: ISocket) => {
      try {
        // Common events that needs to be mounted on the initialization
        this.mountMakeMoveEvent(socket, io);
        this.mountGameReqEvent(socket, io);
        this.mountInitGameEvent(socket);

        socket.on(SocketEvent.DISCONNECT_EVENT, () => {
          console.log("user has disconnected 🚫. userId: " + socket.user?.id);
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
