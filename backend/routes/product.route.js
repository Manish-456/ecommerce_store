import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getFeaturedProducts,
} from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router
  .route("/")
  .get(protectRoute, adminRoute, getAllProducts)
  .post(protectRoute, adminRoute, createProduct);

router.route("/featured").get(getFeaturedProducts);

export default router;
