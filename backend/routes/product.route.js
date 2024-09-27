import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getRecommendedProducts,
} from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/featured", getFeaturedProducts);
router.get("/recommendations", getRecommendedProducts);

router
  .route("/")
  .get(protectRoute, adminRoute, getAllProducts)
  .post(protectRoute, adminRoute, createProduct);

router.route("/:id").delete(protectRoute, adminRoute, deleteProduct);

export default router;
