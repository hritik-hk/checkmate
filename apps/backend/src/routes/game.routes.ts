import express from "express";
import {
  createNewGame,
  handleRandomGame,
  getGamesHistory,
} from "../controllers/game.controllers.js";
const router = express.Router();

router
  .post("/new", createNewGame)
  .post("/random", handleRandomGame)
  .post("/history", getGamesHistory);

export default router;
