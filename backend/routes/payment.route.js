import { Router } from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {
  checkoutSuccess,
  createCheckoutSession,
} from "../controllers/payment.controller.js";

const router = Router();

router.post("/create-checkout-session", protectedRoute, createCheckoutSession);
router.post("/checkout-success", protectedRoute, checkoutSuccess);
export default router;
