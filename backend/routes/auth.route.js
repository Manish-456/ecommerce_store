import { Router } from "express";
import {
  signUp,
  logIn,
  logOut,
  refreshToken,
  getProfile,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = Router();

router
  .post("/signup", signUp)
  .post("/login", logIn)
  .post("/logout", logOut)
  .post("/refresh-token", refreshToken);

router.get("/profile", protectedRoute, getProfile);

export default router;
