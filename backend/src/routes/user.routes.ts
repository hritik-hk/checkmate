import express from "express";
import {
  fetchLoggedInUser,
  fetchUserByUsername,
  createFriendRequest,
  declineFriendRequest,
  addFriendship,
  getRecievedFriendRequests,
  getSentFriendRequests,
  getGamesHistory,
  getOnGoingGame,
  getTournamentHistory,
  getOngoingTournament,
} from "../controllers/user.controllers.js";
const router = express.Router();

router
  .get("/own", fetchLoggedInUser)
  .post("/friend_request", createFriendRequest)
  .post("/decline_friendship", declineFriendRequest)
  .post("/add_friendship", addFriendship)
  .get("/recieved_requests", getRecievedFriendRequests)
  .get("/sent_requests", getSentFriendRequests)
  .post("/game_history", getGamesHistory)
  .post("/ongoing_game", getOnGoingGame)
  .post("/tournament_history", getTournamentHistory)
  .post("/ongoing_tournament", getOngoingTournament)
  .get("/:username", fetchUserByUsername);

export default router;
