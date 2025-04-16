import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import User from "../models/User.js";
import { verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ Fetch User Profile
router.get("/profile", verifyUser, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ msg: "User not found!" });
        }
        res.json({ user });
    } catch (error) {
        console.error("❌ Profile Fetch Error:", error);
        res.status(500).json({ msg: "Server error, please try again!" });
    }
});

// ✅ Update User Profile
router.put("/update", verifyUser, async (req, res) => {
    try {
        const { name, phone, membership } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ msg: "User not found!" });
        }

        user.name = name || user.name;
        user.phone = phone || user.phone;
        user.membership = membership || user.membership;

        await user.save();
        res.json({ msg: "✅ Profile updated successfully!" });
    } catch (error) {
        console.error("❌ Profile Update Error:", error);
        res.status(500).json({ msg: "Server error, please try again!" });
    }
});


export default router;
