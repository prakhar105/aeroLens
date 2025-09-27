import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import detectionRoutes from "./routes/detections.js";


import uploadRoutes from "./routes/upload.js";
import connectMongo from "./services/mongo.js";
import pool, { initPostgres } from "./services/postgres.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/upload", uploadRoutes);
app.use("/detections", detectionRoutes);

const PORT = process.env.PORT || 5000;

// Connect Mongo + Postgres
Promise.all([connectMongo(), initPostgres()])
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Startup error:", err);
  });
