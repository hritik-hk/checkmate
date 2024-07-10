import express from "express";
import {
  createNewGame,
  handleRandomGame,
  getGamesHistory,
  getOnGoingGame,
} from "../controllers/game.controllers.js";
const router = express.Router();

router
  .post("/new", createNewGame)
  .post("/random", handleRandomGame)
  .post("/history", getGamesHistory)
  .post("/ongoing", getOnGoingGame);

export default router;
