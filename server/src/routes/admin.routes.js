import express from 'express';
import { getAdminStats, getAllRestaurants } from '../controllers/admin.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/role.middleware.js';

const router = express.Router();

router.use(protect);
router.use(isAdmin);

router.get('/stats', getAdminStats);
router.get('/restaurants', getAllRestaurants);

export default router;
