import express from "express";
import { createPost, getPosts, toggleLike, addComment, deleteComment, editComment, deletePost, editPost, getSinglePost } from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", protect, upload.single("media"), createPost);
router.get("/", protect, getPosts);
router.delete("/:id", protect, deletePost);
router.put("/:id", protect, editPost);

router.post("/:id/comment", protect, addComment);
router.delete("/:postId/comment/:commentId", protect, deleteComment);
router.put("/:postId/comment/:commentId", protect, editComment);

router.put("/:id/like", protect, toggleLike);
router.get("/:id", protect, getSinglePost);

export default router;

