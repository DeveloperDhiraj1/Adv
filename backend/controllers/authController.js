import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendEmail.js';


export const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; 

        user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            otp,
            otpExpires,
            isVerified: false
        });

        await user.save();

        
        await sendEmail({
            email: user.email,
            subject: 'Email Verification OTP',
            message: `Your OTP for email verification is: ${otp}. It will expire in 10 minutes.`
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully. Please check your email for the verification OTP."
        });

    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


// 2. Verify OTP (Updated)
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Dono check laga diye taaki confusion na ho
        if (user.isVerified || user.isEmailVerified) {
            return res.status(400).json({ success: false, message: "Email is already verified" });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        // Dono fields ko true set kar rahe hain taaki error na aaye
        user.isVerified = true;
        user.isEmailVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully! You can now log in."
        });

    } catch (error) {
        console.error("Verify OTP Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// 3. Login with Verification Check (Updated)
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Yahan dono fields check kar rahe hain (isVerified ya isEmailVerified)
        const isUserVerified = user.isVerified || user.isEmailVerified;

        if (!isUserVerified) {
            return res.status(403).json({ success: false, message: "Please verify your email before logging in." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        if (user.isActive === false) {
            return res.status(403).json({ success: false, message: "Your account has been deactivated. Please contact support." });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            token,
            role: user.role,
            userId: user._id,
            userName: user.name,
            email: user.email
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};