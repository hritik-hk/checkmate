import express from "express";
import {
  createUser,
  loginUser,
  checkAuth,
  logout,
} from "../controllers/auth.controllers.js";
import isAuth from "../middlewares/auth.middlewares.js";

const router = express.Router();

router
  .post("/signup", createUser)
  .post("/login", loginUser)
  .get("/check", isAuth, checkAuth)
  .get("/logout", logout);

export default router;
