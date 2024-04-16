import "dotenv/config";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";
import { initializeSocketIO } from "./socket/socket.js";

import authRouter from "./routes/auth.routes.js";
import isAuth from "./middlewares/auth.middlewares.js";

const PORT = process.env.PORT;

const app = express();
const server = createServer(app);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

app.set("io", io);

app.use("/api/auth", authRouter);

initializeSocketIO(io);

server.listen(PORT, () => {
  console.log(`server listening on PORT: ${PORT}`);
});
