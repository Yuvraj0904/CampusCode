import express from "express";
import { loginLimiter } from "../middleware/rateLimit.middleware.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator.js";
import validate from "../middleware/validation.middleware.js";
import {
  isAuthenticated,
  registerUser,
  userLogin,
  userLogout,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
} from "../controllers/auth.controller.js";
import protectRoute from "../middleware/userAuth.middleware.js";
const router = express.Router();

router.post("/register", registerValidator, validate, registerUser);
router.post("/login", loginLimiter, loginValidator, validate, userLogin);
router.post("/logout", userLogout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/send-verification-email", protectRoute, sendVerificationEmail);

router.get("/verify-email/:token", verifyEmail);

router.get("/is-auth", protectRoute, isAuthenticated);
export default router;
