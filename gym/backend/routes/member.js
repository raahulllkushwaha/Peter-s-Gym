import express from 'express';
import { auth, restrictTo } from '../middleware/auth.js';
import { getMyDiet } from '../controllers/memberController.js';

const router = express.Router();

router.use(auth, restrictTo('member'));
router.get('/diet', getMyDiet);

export default router;