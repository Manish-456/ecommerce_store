import { Router } from "express";
import { signUp, logIn, logOut } from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.post("/logout", logOut);

export default router;
