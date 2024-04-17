import express from "express";
import { createNewGame } from "../controllers/game.controllers.js";
const router = express.Router();

router.get("/new/:recipientId", createNewGame);

export default router;
