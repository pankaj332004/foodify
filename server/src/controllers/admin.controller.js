import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import Order from '../models/Order.js';

// @desc  Get admin dashboard statistics
// @route GET /api/admin/stats
export const getAdminStats = async (req, res, next) => {
    try {
        const [totalUsers, totalRestaurants, totalOrders, revenueData] = await Promise.all([
            User.countDocuments(),
            Restaurant.countDocuments(),
            Order.countDocuments(),
            Order.aggregate([
                { $match: { status: 'delivered' } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ])
        ]);

        const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalRestaurants,
                totalOrders,
                totalRevenue
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc  Get all restaurants (for admin management)
// @route GET /api/admin/restaurants
export const getAllRestaurants = async (req, res, next) => {
    try {
        const restaurants = await Restaurant.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: restaurants.length,
            restaurants
        });
    } catch (err) {
        next(err);
    }
};
