import express from "express";
import {
  fetchLoggedInUser,
  fetchUserByUsername,
  createFriendRequest,
  declineFriendRequest,
  addFriendship,
} from "../controllers/user.controllers.js";
const router = express.Router();

router
  .get("/own", fetchLoggedInUser)
  .get("/:username", fetchUserByUsername)
  .post("/friend_request", createFriendRequest)
  .post("/decline_friendship", declineFriendRequest)
  .post("/add_friendship", addFriendship);

export default router;
