import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createChannel,
  getAllChannels,
  getMyChannel,
  getChannelById,
  toggleSubscribe
} from "../controllers/channelController.js";

const router = express.Router();

router.post("/", protect, createChannel);
router.get("/", getAllChannels);

// IMPORTANT: keep this before "/:id"
router.get("/my-channel", protect, getMyChannel);

router.put("/:id/subscribe", protect, toggleSubscribe);
router.get("/:id", getChannelById);

export default router;