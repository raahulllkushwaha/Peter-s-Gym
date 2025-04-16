import express from 'express';
import { auth, restrictTo } from '../middleware/auth.js';
import { addDiet, updateDiet, addMeal } from '../controllers/trainerController.js';

const router = express.Router();

router.use(auth, restrictTo('trainer'));
router.post('/diet', addDiet);
router.put('/diet/:id', updateDiet);
router.post('/meal', addMeal);

export default router;