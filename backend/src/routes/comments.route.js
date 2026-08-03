import express from "express";

import protectRoute from "../middleware/userAuth.middleware.js";

import {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/:postId", protectRoute, createComment);
router.get("/:postId", getCommentsByPost);
router.put("/:commentId", protectRoute, updateComment);
router.delete("/:commentId", protectRoute, deleteComment);
export default router;