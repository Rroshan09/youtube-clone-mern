import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  addComment,
  getCommentsByVideo,
  updateComment,
  deleteComment
} from "../controllers/commentController.js";

const router = express.Router();

router.post("/", protect, addComment);
router.get("/video/:videoId", getCommentsByVideo);
router.put("/:id", protect, updateComment);
router.delete("/:id", protect, deleteComment);

export default router;