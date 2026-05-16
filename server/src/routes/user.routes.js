import express from 'express';
import {
    getProfile, updateProfile, addAddress, deleteAddress,
    changePassword, getAllUsers, toggleUserStatus,
} from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/role.middleware.js';
import { uploadProfileImage } from '../middleware/upload.middleware.js';

const router = express.Router();

// All below routes require authentication
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', uploadProfileImage, updateProfile);
router.put('/change-password', changePassword);
router.post('/addresses', addAddress);
router.delete('/addresses/:addressId', deleteAddress);

// Admin only
router.get('/', isAdmin, getAllUsers);
router.put('/:id/toggle', isAdmin, toggleUserStatus);

export default router;
