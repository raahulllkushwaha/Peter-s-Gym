import Diet from '../models/Diet.js';
import Meal from '../models/Meal.js';

export const getMyDiet = async (req, res) => {
    try {
        const diets = await Diet.find({ memberId: req.user.id }).populate('trainerId', 'username');
        const meals = await Meal.find({ dietId: { $in: diets.map(d => d._id) } });
        res.json({ diets, meals });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};