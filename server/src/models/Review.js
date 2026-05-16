import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: true,
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true,   // review must be tied to a real order (prevents fake reviews)
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            trim: true,
            default: '',
        },
        images: [{ type: String }],   // optional review photos

        // Separate ratings for food, delivery, packaging
        foodRating: { type: Number, min: 1, max: 5 },
        deliveryRating: { type: Number, min: 1, max: 5 },

        isVerified: { type: Boolean, default: false }, // admin-verified review
    },
    { timestamps: true }
);

// One review per order
reviewSchema.index({ order: 1 }, { unique: true });
reviewSchema.index({ restaurant: 1, createdAt: -1 });

// After saving a review, update the restaurant's aggregate rating
reviewSchema.post('save', async function () {
    const Review = this.constructor;
    const stats = await Review.aggregate([
        { $match: { restaurant: this.restaurant } },
        {
            $group: {
                _id: '$restaurant',
                avgRating: { $avg: '$rating' },
                totalRatings: { $sum: 1 },
            },
        },
    ]);
    if (stats.length > 0) {
        const Restaurant = (await import('./Restaurant.js')).default;
        await Restaurant.findByIdAndUpdate(this.restaurant, {
            rating: Math.round(stats[0].avgRating * 10) / 10,
            totalRatings: stats[0].totalRatings,
        });
    }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
