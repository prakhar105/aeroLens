import express from "express";
import pool from "../services/postgres.js";

const router = express.Router();

// POST /detections → Save AI detection
router.post("/", async (req, res) => {
  try {
    const { uploadId, label, confidence, bbox } = req.body;

    const result = await pool.query(
      "INSERT INTO detections (upload_id, label, confidence, bbox) VALUES ($1, $2, $3, $4) RETURNING *",
      [uploadId, label, confidence,  JSON.stringify(bbox)]
    );

    res.json({ message: "✅ Detection saved", detection: result.rows[0] });
  } catch (err) {
    console.error("Postgres insert error:", err);
    res.status(500).json({ error: "Failed to save detection" });
  }
});

// GET /detections/:uploadId → Get detections for one upload
router.get("/:uploadId", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM detections WHERE upload_id=$1 ORDER BY created_at DESC",
      [req.params.uploadId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Postgres fetch error:", err);
    res.status(500).json({ error: "Failed to fetch detections" });
  }
});

export default router;
