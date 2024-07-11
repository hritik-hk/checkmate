import express from "express";
import {
  createNewGame,
  handleRandomGame,
} from "../controllers/game.controllers.js";
const router = express.Router();

router.post("/new", createNewGame).post("/random", handleRandomGame);

export default router;
