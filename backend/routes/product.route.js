import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
} from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/featured").get(getFeaturedProducts);

router
  .route("/")
  .get(protectRoute, adminRoute, getAllProducts)
  .post(protectRoute, adminRoute, createProduct);

router.route("/:id").delete(protectRoute, adminRoute, deleteProduct);
export default router;
