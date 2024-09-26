import { Router } from "express";
import { getAllProducts } from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/").get(protectRoute, adminRoute, getAllProducts);

export default router;
