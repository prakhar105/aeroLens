// routes/upload.js
import express from "express";
import multer from "multer";
import { Upload } from "../services/mongo.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const newUpload = new Upload({
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
    });

    await newUpload.save();

    // Build absolute URL to access the file
    const fileUrl = `${req.protocol}://${req.get("host")}/files/${req.file.filename}`;

    return res.status(201).json({
      message: "✅ File uploaded and saved successfully",
      upload: {
        id: newUpload._id,
        filename: newUpload.filename,
        originalName: newUpload.originalName,
        size: newUpload.size,
        uploadDate: newUpload.uploadDate,
        url: fileUrl,                 // 🔽 NEW: direct link to file
      },
    });
  } catch (err) {
    console.error("❌ Mongo save error:", err);
    return res.status(500).json({ error: "Database save failed" });
  }
});

router.get("/", async (req, res) => {
  try {
    const uploads = await Upload.find().sort({ uploadDate: -1 });

    // Optionally add URLs in listing too (nice for Postman/browser testing)
    const withUrls = uploads.map((u) => ({
      ...u.toObject(),
      url: `${req.protocol}://${req.get("host")}/files/${u.filename}`,
    }));

    return res.json({
      count: withUrls.length,
      uploads: withUrls,
    });
  } catch (err) {
    console.error("❌ Mongo fetch error:", err);
    return res.status(500).json({ error: "Failed to fetch uploads" });
  }
});

export default router;
