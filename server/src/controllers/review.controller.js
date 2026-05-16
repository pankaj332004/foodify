import Review from '../models/Review.js';
import Order from '../models/Order.js';
import { AppError } from '../middleware/error.middleware.js';

// @desc  Create a review for an order
// @route POST /api/reviews
export const createReview = async (req, res, next) => {
    try {
        const { orderId, rating, comment, foodRating, deliveryRating } = req.body;

        const order = await Order.findById(orderId);
        if (!order) throw new AppError('Order not found', 404);
        if (order.customer.toString() !== req.user._id.toString()) {
            throw new AppError('You can only review your own orders.', 403);
        }
        if (order.status !== 'delivered') {
            throw new AppError('You can only review delivered orders.', 400);
        }

        const existing = await Review.findOne({ order: orderId });
        if (existing) throw new AppError('You have already reviewed this order.', 409);

        const images = req.files ? req.files.map((f) => f.path) : [];

        const review = await Review.create({
            customer: req.user._id,
            restaurant: order.restaurant,
            order: orderId,
            rating,
            comment,
            foodRating,
            deliveryRating,
            images,
        });

        res.status(201).json({ success: true, review });
    } catch (err) { next(err); }
};

// @desc  Get all reviews for a restaurant (public)
// @route GET /api/reviews/restaurant/:restaurantId
export const getRestaurantReviews = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const [reviews, total] = await Promise.all([
            Review.find({ restaurant: req.params.restaurantId })
                .populate('customer', 'name profileImage')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Review.countDocuments({ restaurant: req.params.restaurantId }),
        ]);

        res.status(200).json({
            success: true,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            reviews,
        });
    } catch (err) { next(err); }
};

// @desc  Delete a review [admin or review owner]
// @route DELETE /api/reviews/:id
export const deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) throw new AppError('Review not found', 404);

        const isOwner = review.customer.toString() === req.user._id.toString();
        if (!isOwner && req.user.role !== 'admin') {
            throw new AppError('Not authorized.', 403);
        }

        await review.deleteOne();
        res.status(200).json({ success: true, message: 'Review deleted.' });
    } catch (err) { next(err); }
};
