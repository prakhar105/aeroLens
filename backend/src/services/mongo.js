// services/mongo.js
import mongoose from "mongoose";

/**
 * Connect to MongoDB
 */
const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // fail fast if cannot connect
    });

    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Exit the app if DB connection fails
  }
};

// ----------------------
// Upload Schema & Model
// ----------------------
const uploadSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
      min: 1,
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false, // remove __v field
  }
);

// Add index for faster queries (e.g., sorting by date)
uploadSchema.index({ uploadDate: -1 });

export const Upload = mongoose.model("Upload", uploadSchema);

export default connectMongo;
