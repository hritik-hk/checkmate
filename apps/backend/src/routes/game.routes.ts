import express from "express";
import {
  createNewGame,
  handleRandomGame,
} from "../controllers/game.controllers.js";
const router = express.Router();

router.get("/new/:recipientId", createNewGame).get("/random", handleRandomGame);

export default router;
