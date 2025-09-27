// src/routes.js
import express from "express";
const router = express.Router();

// Example GET route
router.get("/", (req, res) => {
  res.json({ message: "Welcome to the AeroLens API root endpoint 🌍" });
});

// Example POST route
router.post("/echo", (req, res) => {
  const data = req.body;
  res.json({ received: data });
});

// Export router as default
export default router;
