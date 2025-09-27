// routes/detections.js
import express from "express";
import pool from "../services/postgres.js";
import { Upload } from "../services/mongo.js"; // 👈 Import Mongo model

const router = express.Router();

/**
 * POST /detections
 * Save a detection result linked to an upload
 */
router.post("/", async (req, res) => {
  try {
    const { uploadId, label, confidence, bbox } = req.body;

    if (!uploadId || !label || confidence == null || !bbox) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 👇 Step 1: Validate uploadId exists in Mongo
    const uploadExists = await Upload.findById(uploadId);
    if (!uploadExists) {
      return res.status(404).json({ error: "Upload not found in MongoDB" });
    }

    // Insert detection into Postgres
    const query = `
      INSERT INTO detections (upload_id, label, confidence, bbox)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [uploadId, label, confidence, JSON.stringify(bbox)];
    const result = await pool.query(query, values);

    return res.status(201).json({
      message: "✅ Detection saved successfully",
      detection: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Postgres insert error:", err);
    return res.status(500).json({ error: "Failed to save detection" });
  }
});

/**
 * GET /detections/:uploadId
 * Fetch all detections for a given uploadId
 */
router.get("/:uploadId", async (req, res) => {
  try {
    const { uploadId } = req.params;

    // Validate Mongo first
    const uploadExists = await Upload.findById(uploadId);
    if (!uploadExists) {
      return res.status(404).json({ error: "Upload not found in MongoDB" });
    }

    const query = `
      SELECT * FROM detections
      WHERE upload_id = $1
      ORDER BY created_at DESC;
    `;

    const result = await pool.query(query, [uploadId]);

    return res.json({
      upload: {
        id: uploadExists._id,
        filename: uploadExists.filename,
        originalName: uploadExists.originalName,
        size: uploadExists.size,
        uploadDate: uploadExists.uploadDate,
      },
      count: result.rows.length,
      detections: result.rows,
    });
  } catch (err) {
    console.error("❌ Postgres fetch error:", err);
    return res.status(500).json({ error: "Failed to fetch detections" });
  }
});

export default router;
