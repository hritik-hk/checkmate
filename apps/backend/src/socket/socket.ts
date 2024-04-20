import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
import { IRequest, ISocket } from "../interfaces/common.js";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { payload } from "../interfaces/common.js";
import { ChatEvent, GameEvent } from "../constants.js";
import { activeGames } from "../game/game.js";
import { Square } from "chess.js";

//to do : move to common interface exports from packages folder
// export interface move {
//   from: Square;
//   to: Square;
//   piece: string;
//   promotion?: string;
// }

const prisma = new PrismaClient();

const mountJoinRoomEvent = (socket: ISocket) => {
  socket.on(ChatEvent.JOIN_ROOM_EVENT, (roomId) => {
    console.log(`User joined the chat room, roomId: `, roomId);
    socket.join(roomId);
  });
};

const mountNewGameEvent = (socket: ISocket) => {
  socket.on(GameEvent.NEW_GAME_EVENT, (gameId) => {
    console.log(`new game created, gameId: `, gameId);
    socket.join(gameId);
  });
};

const mountMakeMoveEvent = (socket: ISocket, io: Server) => {
  socket.on(GameEvent.MOVE_UPDATE_EVENT, (gameId: string, update: string) => {
    const moveUpdate = JSON.parse(update);

    //update the gameState by playing the move
    const currGame = activeGames.get(gameId);
    const move = { from: moveUpdate.from, to: moveUpdate.to };
    currGame?.makeMove(move, moveUpdate.piece, socket?.user?.id as string);

    io.in(gameId).emit(GameEvent.MOVE_UPDATE_EVENT, currGame?.gameState.fen());
  });
};

const initializeSocketIO = (io: Server): Server => {
  return io.on("connection", async (socket: ISocket) => {
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

      const user = await prisma.user.findUnique({
        where: { id: decodedToken.userId },
      });

      // retrieve the user
      if (!user) {
        //To Do: make a custom error handler
        throw new Error("Un-authorized handshake. Token is invalid");
      }
      socket.user = user; // mount te user object to the socket

      socket.join(user.id);
      socket.emit(ChatEvent.CONNECTED_EVENT); // emit the connected event so that client is aware
      console.log("User connected, userId: ", user.id);

      // Common events that needs to be mounted on the initialization
      mountJoinRoomEvent(socket);
      mountNewGameEvent(socket);
      mountMakeMoveEvent(socket, io);

      socket.on(ChatEvent.DISCONNECT_EVENT, () => {
        console.log("user has disconnected 🚫. userId: " + socket.user?.id);
        if (socket.user?.id) {
          socket.leave(socket.user.id);
        }
      });
    } catch (error) {
      socket.emit(
        ChatEvent.SOCKET_ERROR_EVENT,
        error || "Something went wrong while connecting to the socket."
      );
    }
  });
};

const emitSocketEvent = (
  req: IRequest,
  roomId: string,
  event: string,
  payload: string
) => {
  req.app.get("io").in(roomId).emit(event, payload);
};

export { initializeSocketIO, emitSocketEvent };
