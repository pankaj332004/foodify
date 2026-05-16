import User from '../models/User.js';
import { AppError } from '../middleware/error.middleware.js';

// @desc  Get user profile
// @route GET /api/users/profile
export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        res.status(200).json({ success: true, user });
    } catch (err) { next(err); }
};

// @desc  Update profile (name, phone, profileImage)
// @route PUT /api/users/profile
export const updateProfile = async (req, res, next) => {
    try {
        const { name, phone } = req.body;
        const updates = { name, phone };
        if (req.file) updates.profileImage = req.file.cloudinaryUrl || req.file.path;

        const user = await User.findByIdAndUpdate(req.user._id, updates, {
            new: true, runValidators: true,
        });
        res.status(200).json({ success: true, user });
    } catch (err) { next(err); }
};

// @desc  Add a delivery address
// @route POST /api/users/addresses
export const addAddress = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        user.addresses.push(req.body);
        await user.save();
        res.status(201).json({ success: true, addresses: user.addresses });
    } catch (err) { next(err); }
};

// @desc  Delete a delivery address
// @route DELETE /api/users/addresses/:addressId
export const deleteAddress = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        user.addresses = user.addresses.filter(
            (a) => a._id.toString() !== req.params.addressId
        );
        await user.save();
        res.status(200).json({ success: true, addresses: user.addresses });
    } catch (err) { next(err); }
};

// @desc  Change password
// @route PUT /api/users/change-password
export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id).select('+password');

        if (!(await user.comparePassword(currentPassword))) {
            throw new AppError('Current password is incorrect.', 401);
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({ success: true, message: 'Password updated.' });
    } catch (err) { next(err); }
};

// ── Admin only ───────────────────────────────────────────────────────────────

// @desc  Get all users
// @route GET /api/users  [admin]
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: users.length, users });
    } catch (err) { next(err); }
};

// @desc  Toggle user active status
// @route PUT /api/users/:id/toggle  [admin]
export const toggleUserStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) throw new AppError('User not found', 404);
        user.isActive = !user.isActive;
        await user.save();
        res.status(200).json({ success: true, isActive: user.isActive });
    } catch (err) { next(err); }
};
