import Restaurant from '../models/Restaurant.js';
import { AppError } from '../middleware/error.middleware.js';

// @desc  Get all restaurants (public, with filters)
// @route GET /api/restaurants
export const getRestaurants = async (req, res, next) => {
    try {
        const { city, cuisine, search, page = 1, limit = 10 } = req.query;
        const query = { isActive: true };

        if (city) query['address.city'] = new RegExp(city, 'i');
        if (cuisine) query.cuisineTypes = new RegExp(cuisine, 'i');
        if (search) query.name = new RegExp(search, 'i');

        const skip = (page - 1) * limit;
        const [restaurants, total] = await Promise.all([
            Restaurant.find(query).sort({ rating: -1 }).skip(skip).limit(Number(limit)),
            Restaurant.countDocuments(query),
        ]);

        res.status(200).json({
            success: true,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            restaurants,
        });
    } catch (err) { next(err); }
};

// @desc  Get single restaurant
// @route GET /api/restaurants/:id
export const getRestaurant = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id).populate('owner', 'name email');
        if (!restaurant) throw new AppError('Restaurant not found', 404);
        res.status(200).json({ success: true, restaurant });
    } catch (err) { next(err); }
};

// @desc  Create restaurant
// @route POST /api/restaurants  [restaurant_owner]
export const createRestaurant = async (req, res, next) => {
    try {
        const data = { ...req.body, owner: req.user._id };
        if (req.files?.coverImage) data.coverImage = req.files.coverImage[0].cloudinaryUrl || req.files.coverImage[0].path;
        if (req.files?.images) data.images = req.files.images.map((f) => f.cloudinaryUrl || f.path);

        const restaurant = await Restaurant.create(data);
        res.status(201).json({ success: true, restaurant });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const fields = Object.keys(err.errors).join(', ');
            return res.status(422).json({ success: false, message: 'Missing or Invalid fields: ' + fields });
        }
        next(err);
    }
};

// @desc  Update restaurant
// @route PUT /api/restaurants/:id  [owner | admin]
export const updateRestaurant = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) throw new AppError('Restaurant not found', 404);

        if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            throw new AppError('Not authorized to update this restaurant.', 403);
        }

        const updates = { ...req.body };
        if (req.files?.coverImage) updates.coverImage = req.files.coverImage[0].cloudinaryUrl || req.files.coverImage[0].path;
        if (req.files?.images) updates.images = req.files.images.map((f) => f.cloudinaryUrl || f.path);

        const updated = await Restaurant.findByIdAndUpdate(req.params.id, updates, {
            new: true, runValidators: true,
        });
        res.status(200).json({ success: true, restaurant: updated });
    } catch (err) { next(err); }
};

// @desc  Toggle open/closed status
// @route PUT /api/restaurants/:id/toggle-open  [owner]
export const toggleOpen = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) throw new AppError('Restaurant not found', 404);
        if (restaurant.owner.toString() !== req.user._id.toString()) {
            throw new AppError('Not authorized.', 403);
        }
        restaurant.isOpen = !restaurant.isOpen;
        await restaurant.save();
        res.status(200).json({ success: true, isOpen: restaurant.isOpen });
    } catch (err) { next(err); }
};

// @desc  Delete restaurant  [admin]
// @route DELETE /api/restaurants/:id
export const deleteRestaurant = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
        if (!restaurant) throw new AppError('Restaurant not found', 404);
        res.status(200).json({ success: true, message: 'Restaurant deleted.' });
    } catch (err) { next(err); }
};

// @desc  Get owner's own restaurants
// @route GET /api/restaurants/my  [restaurant_owner]
export const getMyRestaurants = async (req, res, next) => {
    try {
        const restaurants = await Restaurant.find({ owner: req.user._id });
        res.status(200).json({ success: true, restaurants });
    } catch (err) { next(err); }
};
