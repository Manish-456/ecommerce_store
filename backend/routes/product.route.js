import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getRecommendedProducts,
  toggleFeaturedProduct,
} from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/featured", getFeaturedProducts);
router.get("/recommendations", getRecommendedProducts);
router.get("/category/:category", getProductsByCategory);

router
  .route("/")
  .get(protectRoute, adminRoute, getAllProducts)
  .post(protectRoute, adminRoute, createProduct);

router
  .route("/:id")
  .delete(protectRoute, adminRoute, deleteProduct)
  .patch(protectRoute, adminRoute, toggleFeaturedProduct);

export default router;
