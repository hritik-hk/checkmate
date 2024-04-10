import "dotenv/config";
import express from "express";
import { createServer } from "http";

const PORT = process.env.PORT;

const app = express();
const server = createServer(app);

server.listen(PORT, () => {
    console.log(`server listening on PORT: ${PORT}`);
  });