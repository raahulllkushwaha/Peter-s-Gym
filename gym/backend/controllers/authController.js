import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

export const registerUser = async (req, res) => {
  try {
        console.log("📩 Received Data:", req.body); // Debugging

        const { name, email, password, phone, membership, message, gender } = req.body;

        // ✅ Check for missing fields
        if (!name || !email || !password || !phone || !membership || !gender) {
            return res.status(400).json({ success: false, msg: "⚠ All fields are required!" });
        }

        // ✅ Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, msg: "❌ Email already exists!" });
        }

        // ✅ Save user in DB
        const newUser = new User({ name, email, password, phone, membership, message, gender });
        await newUser.save();

        console.log("✅ User registered successfully!");
        return res.json({ success: true, msg: "✅ User registered successfully!" });

    } catch (error) {
        console.error("❌ Registration Error:", error);
        return res.status(500).json({ success: false, msg: "⚠ Server error, please try again!" });
    }
};

export const loginUser = async (req, res) => {
    try {
        console.log("🔥 Login Request:", req.body);

        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, msg: "❌ Invalid email or password!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, msg: "❌ Invalid email or password!" });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

        if (user.role === "admin") {
            return res.json({ success: true, msg: "✅ Admin login successful!", token, role: "admin" });
        } else {
            return res.json({ success: true, msg: "✅ User login successful!", token, role: "user" });
        }

    } catch (error) {
        console.error("❌ Login Error:", error);
        return res.status(500).json({ success: false, msg: "⚠ Server error, please try again!" });
    }
};