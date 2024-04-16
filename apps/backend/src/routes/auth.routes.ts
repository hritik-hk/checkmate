import express from "express";
import {
  createUser,
  loginUser,
  checkAuth,
} from "../controllers/auth.controllers.js";
import isAuth from "../middlewares/auth.middlewares.js";

const router = express.Router();

router
  .post("/signup", createUser)
  .post("/login", loginUser)
  .get("/check", isAuth, checkAuth);

export default router;
