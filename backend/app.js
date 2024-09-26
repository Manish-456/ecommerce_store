import "dotenv/config";
import express from "express";

// routes
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

const app = express();

app.set("x-powered-by", false);
app.set("etag", false);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);

export default app;
