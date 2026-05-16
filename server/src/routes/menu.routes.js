import express from 'express';
import {
    getMenu, addMenuItem, updateMenuItem, toggleAvailability, deleteMenuItem,
} from '../controllers/menu.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { isAdminOrOwner } from '../middleware/role.middleware.js';
import { uploadMenuItemImage } from '../middleware/upload.middleware.js';
import { validateMenuItem } from '../validators/restaurant.validator.js';

const router = express.Router();

// Public
router.get('/:restaurantId', getMenu);

// Protected — restaurant owner or admin
router.post('/:restaurantId',
    protect,
    isAdminOrOwner,
    uploadMenuItemImage,
    validateMenuItem,
    addMenuItem
);
router.put('/item/:itemId',
    protect,
    isAdminOrOwner,
    uploadMenuItemImage,
    updateMenuItem
);
router.put('/item/:itemId/toggle', protect, isAdminOrOwner, toggleAvailability);
router.delete('/item/:itemId', protect, isAdminOrOwner, deleteMenuItem);

export default router;
