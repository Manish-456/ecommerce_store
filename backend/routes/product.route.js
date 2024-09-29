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
import { adminRoute, protectedRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/featured", getFeaturedProducts);
router.get("/recommendations", getRecommendedProducts);
router.get("/category/:category", getProductsByCategory);

router
  .route("/")
  .get(protectedRoute, adminRoute, getAllProducts)
  .post(protectedRoute, adminRoute, createProduct);

router
  .route("/:id")
  .delete(protectedRoute, adminRoute, deleteProduct)
  .patch(protectedRoute, adminRoute, toggleFeaturedProduct);

export default router;
