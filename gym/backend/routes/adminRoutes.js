import express from 'express';
import User from '../models/User.js';
import multer from "multer";
import path from "path";
import { verifyAdmin } from "../middleware/authMiddleware.js";
import { getUsers, deleteUser } from "../controllers/adminController.js";
import Trainer from "../models/Trainer.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: "./uploads/trainers/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});
const upload = multer({ storage });

// ✅ Get all users (Admin only)
router.get("/users", verifyAdmin, getUsers);

// ✅ Delete user (Admin only)
router.delete("/delete/:id", verifyAdmin, deleteUser);


router.put("/update/:id", verifyAdmin, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ success: false, msg: "❌ Forbidden! Admin access only." });
        }

        const { name, phone, membership } = req.body;
        const user = await User.findById(req.params.id); // ✅ Use req.params.id

        if (!user) {
            return res.status(404).json({ msg: "❌ User not found!" });
        }

        user.name = name || user.name;
        user.phone = phone || user.phone;
        user.membership = membership || user.membership;

        await user.save();
        res.json({ success: true, msg: "✅ Profile updated successfully!" });
    } catch (error) {
    console.error("❌ Update Error:", error.message, error.stack);
    res.status(500).json({ success: false, msg: error.message }); // Return actual error
}

});

// 🟢 Get All Trainers


router.get("/trainers", verifyAdmin, async (req, res) => {
    try {
        const trainers = await Trainer.find();
        res.json({ trainers });
    } catch (error) {
        console.error("❌ Fetch Trainer Error:", error);
        res.status(500).json({ msg: "Server error, please try again!" });
    }
});

router.post("/trainers", verifyAdmin, upload.single("image"), async (req, res) => {
    try {
        const { name, email, specialization, phone } = req.body;

        if (!name || !email || !specialization || !phone) {
            return res.status(400).json({ msg: "❌ All fields are required!" });
        }

        const existingTrainer = await Trainer.findOne({ email });
        if (existingTrainer) {
            return res.status(400).json({ msg: "❌ Trainer already exists!" });
        }

        const imagePath = req.file ? `/uploads/trainers/${req.file.filename}` : null;

        const newTrainer = new Trainer({ name, email, specialization, phone, image: imagePath });
        await newTrainer.save();

        res.json({ success: true, msg: "✅ Trainer added successfully!", trainer: newTrainer });
    } catch (error) {
        console.error("❌ Trainer Add Error:", error);
        res.status(500).json({ msg: "Server error, please try again!" });
    }
});

// Serve Uploaded Images
router.use("/uploads", express.static("uploads"));


// 🟢 Delete Trainer
router.delete("/trainers/:id", verifyAdmin, async (req, res) => {
    try {
        await Trainer.findByIdAndDelete(req.params.id);
        res.json({ success: true, msg: "✅ Trainer deleted successfully!" });
    } catch (error) {
        console.error("❌ Delete Trainer Error:", error);
        res.status(500).json({ msg: "Server error, please try again!" });
    }
});


export default router;
