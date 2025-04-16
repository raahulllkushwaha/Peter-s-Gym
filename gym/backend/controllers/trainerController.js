import Diet from '../models/Diet.js';
import Meal from '../models/Meal.js';

export const addDiet = async (req, res) => {
    const { memberId, title, description } = req.body;
    try {
        const diet = new Diet({ memberId, trainerId: req.user.id, title, description });
        await diet.save();
        res.status(201).json(diet);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateDiet = async (req, res) => {
    const { id } = req.params;
    try {
        const diet = await Diet.findOneAndUpdate(
            { _id: id, trainerId: req.user.id },
            req.body,
            { new: true }
        );
        if (!diet) return res.status(404).json({ message: 'Diet not found or not authorized' });
        res.json(diet);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const addMeal = async (req, res) => {
    const { dietId, name, calories, description } = req.body;
    try {
        const diet = await Diet.findOne({ _id: dietId, trainerId: req.user.id });
        if (!diet) return res.status(404).json({ message: 'Diet not found or not authorized' });
        
        const meal = new Meal({ dietId, name, calories, description });
        await meal.save();
        res.status(201).json(meal);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};