import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getFirebaseAdminAuth } from '../config/firebaseAdmin.js';


export const signup = async (req, res) => {
    try {
        const { name, email, password, role, firebaseUid, firebaseIdToken } = req.body;

        if (!firebaseUid || !firebaseIdToken) {
            return res.status(400).json({ success: false, message: "Firebase verification is required" });
        }

        const firebaseUser = await getFirebaseAdminAuth().verifyIdToken(firebaseIdToken);
        if (firebaseUser.uid !== firebaseUid || firebaseUser.email?.toLowerCase() !== email?.toLowerCase()) {
            return res.status(401).json({ success: false, message: "Invalid Firebase account" });
        }

        user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            firebaseUid,
            isEmailVerified: Boolean(firebaseUser.email_verified)
        });

        await user.save();

        return res.status(201).json({
            success: true,
            message: "Account created. Please verify your email before logging in."
        });

    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({ success: false, message: "Unable to create account" });
    }
};

export const verifyFirebaseEmail = async (req, res) => {
    try {
        const authHeader = req.headers.authorization || '';
        const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
        if (!idToken) {
            return res.status(401).json({ success: false, message: "Firebase token is required" });
        }

        const firebaseUser = await getFirebaseAdminAuth().verifyIdToken(idToken, true);
        if (!firebaseUser.email_verified) {
            return res.status(400).json({ success: false, message: "Please click the verification link in your email first" });
        }

        const user = await User.findOne({ firebaseUid: firebaseUser.uid });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.isEmailVerified = true;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully. You can now log in."
        });

    } catch (error) {
        console.error("Firebase verification Error:", error.message);
        return res.status(401).json({ success: false, message: "Firebase verification failed" });
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
