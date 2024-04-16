import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
import { IRequest, ISocket } from "../interfaces/common.js";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { payload } from "../interfaces/common.js";
import { ChatEvent } from "../constants.js";

const prisma = new PrismaClient();

const mountJoinRoomEvent = (socket: ISocket) => {
  socket.on(ChatEvent.JOIN_ROOM_EVENT, (roomId) => {
    console.log(`User joined the game room, roomId: `, roomId);
    socket.join(roomId);
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
