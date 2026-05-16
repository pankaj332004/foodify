import express from 'express';
import {
    createReview, getRestaurantReviews, deleteReview,
} from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { uploadReviewImages } from '../middleware/upload.middleware.js';

const router = express.Router();

// Public
router.get('/restaurant/:restaurantId', getRestaurantReviews);

// Protected
router.post('/', protect, uploadReviewImages, createReview);
router.delete('/:id', protect, deleteReview);

export default router;
