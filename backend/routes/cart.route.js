import { Router } from "express";
import {
  addToCart,
  getCartProducts,
  removeAllFromCart,
  updateQuantity,
} from "../controllers/cart.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = Router();

router
  .route("/")
  .get(protectedRoute, getCartProducts)
  .post(protectedRoute, addToCart)
  .delete(protectedRoute, removeAllFromCart);

router.put("/:id", protectedRoute, updateQuantity);

export default router;
