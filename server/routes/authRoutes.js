import express from "express";
import { generateOTP, signup, login, verifyAndLogin } from "../controllers/auth.js";
import verifyOTP from "../middlewares/verifyOtp.js";

const router = express.Router();

router.post("/generate-otp", generateOTP);
router.post("/signup", verifyOTP, signup);
router.post("/login", login);
router.post("/verify-otp", verifyOTP, verifyAndLogin);

export default router;
