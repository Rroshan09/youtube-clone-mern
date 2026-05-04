import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createChannel,
  getAllChannels,
  getChannelById,
  toggleSubscribe
} from "../controllers/channelController.js";

const router = express.Router();

// Create channel (protected)
router.post("/", protect, createChannel);

// Get all channels
router.get("/", getAllChannels);

// Subscribe / Unsubscribe (protected)
router.put("/:id/subscribe", protect, toggleSubscribe);

// Get single channel
router.get("/:id", getChannelById);

export default router;