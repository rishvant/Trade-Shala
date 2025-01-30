import User from "../models/User.Model.js";
import OTP from "../models/Otp.Model.js";
import twilio from "twilio";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Twilio Configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

// Generate OTP
const generateOTP = async (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return res.status(400).json({ message: "Phone number is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
    const expiresAt = new Date(Date.now() + 5 * 60000); // OTP expires in 5 minutes

    await OTP.create({ phoneNumber, otp, expiresAt });

    // Send OTP via Twilio
    await client.messages.create({
        body: `Your OTP is ${otp}`,
        from: twilioPhone,
        to: phoneNumber
    });

    res.status(200).json({ message: "OTP sent successfully" });
};

// Signup
const signup = async (req, res) => {
    const { name, phoneNumber, password } = req.body;

    if (!name || !phoneNumber || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, phoneNumber, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully", user });
};

// Login
const login = async (req, res) => {
    const { phoneNumber, password } = req.body;

    const user = await User.findOne({ phoneNumber });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });
};

// Verify OTP and login user
const verifyAndLogin = async (req, res) => {
    const { phoneNumber } = req.body;

    const user = await User.findOne({ phoneNumber });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "OTP verified, login successful", token });
};

export { generateOTP, signup, login, verifyAndLogin };
