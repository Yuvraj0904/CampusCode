import express from "express";
import protectRoute from "../middleware/userAuth.middleware.js";
import {
  getMyProfile,
  updateProfile,
  getUserProfile,
  searchUsers,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/me", protectRoute, getMyProfile);
router.put("/update-profile", protectRoute, updateProfile);
router.get("/search/users", searchUsers);
router.get("/:username", getUserProfile);
export default router;
