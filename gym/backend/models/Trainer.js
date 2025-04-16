import mongoose from "mongoose";

const TrainerSchema = new mongoose.Schema({
    name: String,
    email: String,
    specialization: String,
    phone: String,
    image: String // Image path
});

const Trainer = mongoose.model("Trainer", TrainerSchema);
export default Trainer;
