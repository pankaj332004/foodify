import MenuItem from '../models/MenuItem.js';
import Restaurant from '../models/Restaurant.js';
import { AppError } from '../middleware/error.middleware.js';

// Helper — verify the requesting user owns the restaurant
const verifyOwnership = async (restaurantId, userId, role) => {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) throw new AppError('Restaurant not found', 404);
    if (restaurant.owner.toString() !== userId.toString() && role !== 'admin') {
        throw new AppError('Not authorized to manage this restaurant\'s menu.', 403);
    }
    return restaurant;
};

// @desc  Get all menu items for a restaurant (public)
// @route GET /api/menu/:restaurantId
export const getMenu = async (req, res, next) => {
    try {
        const items = await MenuItem.find({
            restaurant: req.params.restaurantId,
            isAvailable: true,
        }).sort({ category: 1, name: 1 });

        // Group by category for easy frontend rendering
        const grouped = items.reduce((acc, item) => {
            if (!acc[item.category]) acc[item.category] = [];
            acc[item.category].push(item);
            return acc;
        }, {});

        res.status(200).json({ success: true, menu: grouped, items });
    } catch (err) { next(err); }
};

// @desc  Add menu item  [restaurant_owner | admin]
// @route POST /api/menu/:restaurantId
export const addMenuItem = async (req, res, next) => {
    try {
        await verifyOwnership(req.params.restaurantId, req.user._id, req.user.role);
        const data = { ...req.body, restaurant: req.params.restaurantId };
        if (req.file) data.image = req.file.cloudinaryUrl || req.file.path;

        const item = await MenuItem.create(data);
        res.status(201).json({ success: true, item });
    } catch (err) { next(err); }
};

// @desc  Update menu item
// @route PUT /api/menu/item/:itemId
export const updateMenuItem = async (req, res, next) => {
    try {
        const item = await MenuItem.findById(req.params.itemId);
        if (!item) throw new AppError('Menu item not found', 404);

        await verifyOwnership(item.restaurant, req.user._id, req.user.role);

        const updates = { ...req.body };
        if (req.file) updates.image = req.file.cloudinaryUrl || req.file.path;

        const updated = await MenuItem.findByIdAndUpdate(req.params.itemId, updates, {
            new: true, runValidators: true,
        });
        res.status(200).json({ success: true, item: updated });
    } catch (err) { next(err); }
};

// @desc  Toggle item availability
// @route PUT /api/menu/item/:itemId/toggle
export const toggleAvailability = async (req, res, next) => {
    try {
        const item = await MenuItem.findById(req.params.itemId);
        if (!item) throw new AppError('Item not found', 404);
        await verifyOwnership(item.restaurant, req.user._id, req.user.role);
        item.isAvailable = !item.isAvailable;
        await item.save();
        res.status(200).json({ success: true, isAvailable: item.isAvailable });
    } catch (err) { next(err); }
};

// @desc  Delete menu item
// @route DELETE /api/menu/item/:itemId
export const deleteMenuItem = async (req, res, next) => {
    try {
        const item = await MenuItem.findById(req.params.itemId);
        if (!item) throw new AppError('Item not found', 404);
        await verifyOwnership(item.restaurant, req.user._id, req.user.role);
        await item.deleteOne();
        res.status(200).json({ success: true, message: 'Item deleted.' });
    } catch (err) { next(err); }
};
