import express from "express";
import protectRoute from "../middleware/userAuth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";
import {
  getDashboardStats,
  deletePost,
  toggleBanUser,
  togglePinPost,
  toggleVerifyPost,
} from "../controllers/admin.controller.js";
const router = express.Router();

router.get("/dashboard", protectRoute, adminMiddleware, getDashboardStats);
router.delete("/posts/:postId", protectRoute, adminMiddleware, deletePost);
router.patch(
  "/users/:userId/ban",
  protectRoute,
  adminMiddleware,
  toggleBanUser,
);
router.patch(
  "/posts/:postId/toggle-pin",
  protectRoute,
  adminMiddleware,
  togglePinPost,
);
router.patch(
  "/posts/:postId/toggle-verify",
  protectRoute,
  adminMiddleware,
  toggleVerifyPost,
);
export default router;
