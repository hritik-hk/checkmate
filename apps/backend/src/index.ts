import "dotenv/config";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import SocketService from "./socket/socketService.js";
import gameManager from "./game/gameManager.js";
import tournamentManager from "./tournament/tournamentManager.js";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import gameRouter from "./routes/game.routes.js";
import isAuth from "./middlewares/auth.middlewares.js";

const PORT = process.env.PORT;

const app = express();
const server = createServer(app);
const gamesHandler: gameManager = new gameManager();
const tournamentHandler: tournamentManager = new tournamentManager();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

const socketServer = new SocketService();

socketServer.io.attach(server);

const emitSocketEvent = (roomId: string, event: string, payload: any) => {
  socketServer.io.in(roomId).emit(event, payload);
};

app.use("/api/auth", authRouter);
app.use("/api/user", isAuth, userRouter);
app.use("/api/game", isAuth, gameRouter);

socketServer.initializeSocketService();

server.listen(PORT, () => {
  console.log(`server listening on PORT: ${PORT}`);
});

export { socketServer, gamesHandler, tournamentHandler, emitSocketEvent };
