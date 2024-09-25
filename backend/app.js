import "dotenv/config";
import express from "express";

// routes
import authRoutes from "./routes/auth.route.js";

const app = express();

app.set("x-powered-by", false);

// Middleware
app.use(express.json());

app.use("/api/auth", authRoutes);

export default app;
