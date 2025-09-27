import express from "express";
import multer from "multer";
import { Upload } from "../services/mongo.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// =====================
// POST /upload → Upload file + save metadata
// =====================
router.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const newUpload = new Upload({
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
    });

    await newUpload.save();

    res.json({
      message: "✅ File saved in DB",
      id: newUpload._id,
      filename: newUpload.filename,
      originalName: newUpload.originalName,
      size: newUpload.size,
      uploadDate: newUpload.uploadDate,
    });
  } catch (err) {
    console.error("Mongo save error:", err);
    res.status(500).json({ error: "DB save failed" });
  }
});

// =====================
// GET /upload → Fetch all uploads
// =====================
router.get("/", async (req, res) => {
  try {
    const uploads = await Upload.find().sort({ uploadDate: -1 });
    res.json(uploads);
  } catch (err) {
    console.error("Mongo fetch error:", err);
    res.status(500).json({ error: "Failed to fetch uploads" });
  }
});

export default router;
