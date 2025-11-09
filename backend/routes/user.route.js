import express from "express"
import { logout, sendOtp,login, updateProfile, checkAuthenticated, verifyOtpp, } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";


const router = express.Router();

// routes
router.post("/send-otp", sendOtp)
router.post("/verify-otp", verifyOtpp)
router.post("/user-login", login)
router.get("/logout", logout)

// protected routes
router.put("/update-profile", authMiddleware, updateProfile);
router.get("/check-auth", authMiddleware, checkAuthenticated)


export default router;