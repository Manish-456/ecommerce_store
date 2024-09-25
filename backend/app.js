import "dotenv/config";
import express from "express";

// routes
import authRoutes from "./routes/auth.route.js";

const app = express();

app.set("x-powered-by", false);

app.use("/api/auth", authRoutes);

export default app;
