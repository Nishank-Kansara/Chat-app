import express from "express";
import {
    checkAuth,
    login,
    logout,
    signup,
    updateProfile,
    forgetPassword,
    verifyOTP,
    resetPassword,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Authentication routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", protectRoute, checkAuth);
router.put("/update-profile", protectRoute, updateProfile);

// Password reset routes
router.post("/forget-password", forgetPassword); // To send OTP
router.post("/verify-otp", verifyOTP); // To verify OTP
router.post("/reset-password",protectRoute,resetPassword); // To reset password

export default router;
