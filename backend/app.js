import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";

// routes
import authRoutes from "./routes/auth.route.js";
import cartRoutes from "./routes/cart.route.js";
import productRoutes from "./routes/product.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
const app = express();

app.set("x-powered-by", false);
app.set("etag", false);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

export default app;
