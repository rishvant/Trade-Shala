import express from "express";
import { generateOTP, signup, login, verifyAndLogin, getUser, generateEmailOTP } from "../controllers/auth.js";
import verifyOTP from "../middlewares/verifyOtp.js";

const router = express.Router();

router.post("/generate_otp", generateOTP);
router.post("/generate_email_otp", generateEmailOTP);
router.post("/signup", verifyOTP, signup);
router.post("/login/email", login);
router.post("/login/phone", verifyOTP, verifyAndLogin);
router.post("/user", getUser);

export default router;
