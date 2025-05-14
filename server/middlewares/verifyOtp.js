import OTP from "../models/Otp.Model.js";

const verifyOTP = async (req, res, next) => {
    const { email, otp } = req.body;

    if ((!email) || !otp) {
        return res.status(400).json({ message: "OTP and either phone number or email are required" });
    }

    try {
        // Build query based on provided identifier
        const query = { email, otp };

        const otpRecord = await OTP.findOne(query);

        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        const currentTime = new Date();
        if (otpRecord.expiresAt < currentTime) {
            return res.status(400).json({ message: "OTP expired" });
        }

        // OTP is valid, delete it and proceed
        await OTP.deleteOne({ _id: otpRecord._id });

        next();
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default verifyOTP;
