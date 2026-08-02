import express from "express";
import protectRoute from "../middleware/userAuth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";

const router = express.Router();
router.post("/create", protectRoute, upload.array("images", 5), createPost);
router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.put("/:id", protectRoute, updatePost);
router.delete("/:id", protectRoute, deletePost);
export default router;
