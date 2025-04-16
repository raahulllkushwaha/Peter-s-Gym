import User from "../models/User.js";

// ✅ Get all users (Only for Admins)
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}, "-password"); // Exclude password
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Server Error" });
    }
};

// ✅ Delete User (Only for Admins)
export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, msg: "User deleted successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Server Error" });
    }
};
