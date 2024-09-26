import { Router } from "express";
import {
  signUp,
  logIn,
  logOut,
  refreshToken,
} from "../controllers/auth.controller.js";

const router = Router();

router
  .post("/signup", signUp)
  .post("/login", logIn)
  .post("/logout", logOut)
  .post("/refresh-token", refreshToken);

export default router;
