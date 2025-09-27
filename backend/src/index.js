// src/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import detectionRoutes from "./routes/detections.js";
import uploadRoutes from "./routes/upload.js";

import connectMongo from "./services/mongo.js";
import pool, { initPostgres } from "./services/postgres.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- Middleware ----------
app.use(cors());              // Enable CORS
app.use(express.json());      // Parse JSON request bodies


app.use("/files", express.static("uploads"));
// ---------- Routes ----------
app.use("/upload", uploadRoutes);
app.use("/detections", detectionRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "✅ AeroLens Backend is up and running!" });
});

// ---------- Database Connections ----------
async function startServer() {
  try {
    // Connect to MongoDB + Postgres in parallel
    await Promise.all([connectMongo(), initPostgres()]);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1); // Exit with failure
  }
}

startServer();
