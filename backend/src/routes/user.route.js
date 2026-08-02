import express from "express";
import protectRoute from "../middleware/userAuth.middleware.js";
import {
  getMyProfile,
  updateProfile,
  getUserProfile,
  searchUsers,
  followUser,
  unfollowUser,
  uploadAvatar,
} from "../controllers/user.controller.js";
import upload from "../middleware/upload.middleware.js";
const router = express.Router();

router.get("/me", protectRoute, getMyProfile);
router.put("/update-profile", protectRoute, updateProfile);
router.get("/search/users", searchUsers);
router.get("/:username", getUserProfile);
router.put("/follow/:id", protectRoute, followUser);
router.put("/unfollow/:id", protectRoute, unfollowUser);

router.put("/upload-avatar",protectRoute,upload.single("avatar"),uploadAvatar)
export default router;
