import express from "express";
import {
  createTournament,
  getPointsTable,
  getFixture,
  getOngoingTournamentGames,
} from "../controllers/tournament.controllers.js";
const router = express.Router();

router
  .post("/new", createTournament)
  .post("/points", getPointsTable)
  .post("/fixture", getFixture)
  .post("/ongoing_games", getOngoingTournamentGames);

export default router;
