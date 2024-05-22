import express from "express";
import {
  fetchLoggedInUser,
  fetchUserByUsername,
  createFriendRequest,
  declineFriendRequest,
  addFriendship,
  getFriendRequests,
} from "../controllers/user.controllers.js";
const router = express.Router();

router
  .get("/own", fetchLoggedInUser)
  .post("/friend_request", createFriendRequest)
  .post("/decline_friendship", declineFriendRequest)
  .post("/add_friendship", addFriendship)
  .get("/requests", getFriendRequests)
  .get("/:username", fetchUserByUsername);

export default router;
