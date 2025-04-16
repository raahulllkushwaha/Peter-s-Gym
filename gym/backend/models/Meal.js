import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
    dietId: { type: mongoose.Schema.Types.ObjectId, ref: 'Diet', required: true },
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    description: { type: String }
});

export default mongoose.model('Meal', mealSchema);