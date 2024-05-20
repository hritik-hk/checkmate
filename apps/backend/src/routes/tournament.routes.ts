import express from "express";
import {
  createTournament,
  getPointsTable,
  getFixture,
  getTournamentHistory,
} from "../controllers/tournament.controllers.js";
const router = express.Router();

router
  .post("/new", createTournament)
  .post("/points", getPointsTable)
  .post("/fixture", getFixture)
  .post("history", getTournamentHistory);

export default router;
