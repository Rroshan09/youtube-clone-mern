import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo
} from "../controllers/videoController.js";

const router = express.Router();
router.get("/", getAllVideos);

router.put("/:id/like", protect, likeVideo);
router.put("/:id/dislike", protect, dislikeVideo);

router.get("/:id", getVideoById);
router.post("/", protect, createVideo);
router.put("/:id", protect, updateVideo);
router.delete("/:id", protect, deleteVideo);

export default router;