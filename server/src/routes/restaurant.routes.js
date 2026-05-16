import express from 'express';
import {
    getRestaurants, getRestaurant, createRestaurant,
    updateRestaurant, toggleOpen, deleteRestaurant, getMyRestaurants,
} from '../controllers/restaurant.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { isAdmin, isAdminOrOwner, isRestaurantOwner } from '../middleware/role.middleware.js';
import { uploadRestaurantImages } from '../middleware/upload.middleware.js';
import { validateCreateRestaurant } from '../validators/restaurant.validator.js';

const router = express.Router();

// Public
router.get('/', getRestaurants);
router.get('/my', protect, isRestaurantOwner, getMyRestaurants);
router.get('/:id', getRestaurant);

// Middleware to parse FormData JSON strings
const parseJsonFields = (req, res, next) => {
    if (typeof req.body.address === 'string') {
        try { req.body.address = JSON.parse(req.body.address); } catch (e) { }
    }
    if (typeof req.body.cuisineTypes === 'string') {
        try { req.body.cuisineTypes = JSON.parse(req.body.cuisineTypes); } catch (e) { }
    }
    next();
};

// Protected
router.post('/',
    protect,
    isRestaurantOwner,
    uploadRestaurantImages,
    parseJsonFields,
    validateCreateRestaurant,
    createRestaurant
);
router.put('/:id',
    protect,
    isAdminOrOwner,
    uploadRestaurantImages,
    parseJsonFields,
    updateRestaurant
);
router.put('/:id/toggle-open', protect, isRestaurantOwner, toggleOpen);
router.delete('/:id', protect, isAdmin, deleteRestaurant);

export default router;
