import { Router } from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getCoupon, validateCoupon } from "../controllers/coupon.controller.js";

const router = Router();

router.get("/", protectedRoute, getCoupon);
router.post("/validate", protectedRoute, validateCoupon);

export default router;
