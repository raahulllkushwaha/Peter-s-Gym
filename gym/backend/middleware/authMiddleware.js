import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyAdmin = async (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        console.log("⛔ No token found!");
        return res.status(401).json({ success: false, msg: "⚠ No token provided!" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Decoded Token:", decoded); // 🛠 Debugging

        // Fetch user from DB
        req.user = await User.findById(decoded.userId).select("-password");
        console.log("🛠 User from DB:", req.user); // Debugging

        // Role check
        if (!req.user || req.user.role !== "admin") {
            console.log("⛔ Access Denied! User role:", req.user?.role);
            return res.status(403).json({ success: false, msg: "❌ Forbidden! Admin access required." });
        }

        next();
    } catch (error) {
        console.log("❌ Token Verification Error:", error);
        return res.status(403).json({ success: false, msg: "❌ Invalid or expired token!" });
    }
};
export const verifyUser = async (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ msg: "⚠ Unauthorized! No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select("-password");

        if (!req.user) {
            return res.status(404).json({ msg: "User not found!" });
        }

        next();
    } catch (error) {
        console.error("❌ Auth Error:", error);
        res.status(401).json({ msg: "Invalid or expired token!" });
    }
};