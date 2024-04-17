import express from "express";
import {
  fetchLoggedInUser,
  fetchUserByUsername,
} from "../controllers/user.controllers.js";
const router = express.Router();

router.get("/own", fetchLoggedInUser).get("/:username", fetchUserByUsername);

export default router;
