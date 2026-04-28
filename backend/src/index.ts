import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { authMiddleware } from "./middleware/auth";
import { createRateLimiter } from "./middleware/rateLimit";
import convertRouter from "./routes/convert";
import healthRouter from "./routes/health";

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing
app.use(express.json({ limit: "1mb" }));

// Rate limiting
app.use(createRateLimiter());

// Authentication
app.use("/api/convert", authMiddleware);

// Routes
app.use("/api/convert", convertRouter);
app.use("/health", healthRouter);

// Start server
app.listen(PORT, () => {
  console.log(`md2img backend running on http://localhost:${PORT}`);
  console.log(`Auth: ${process.env.AUTH_ENABLED === "true" ? "enabled" : "disabled"}`);
  console.log(`Rate limiting: ${process.env.QUOTA_ENABLED === "true" ? "enabled" : "disabled"}`);
});

export default app;