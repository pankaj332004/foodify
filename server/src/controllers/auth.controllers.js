import User from '../models/User.js';
import { sendTokenResponse } from '../utils/generateToken.js';
import { AppError } from '../middleware/error.middleware.js';

// @desc  Register new user
// @route POST /api/auth/register
export const register = async (req, res, next) => {
    try {
        const { name, email, password, phone, role } = req.body;

        const existing = await User.findOne({ email });
        if (existing) throw new AppError('Email already registered.', 409);

        const user = await User.create({ name, email, password, phone, role });

        // If registering as a delivery partner, provision their partner schema too
        if (role === 'delivery_partner') {
            const DeliveryPartner = (await import('../models/DeliveryPartner.js')).default;
            await DeliveryPartner.create({ user: user._id, vehicleType: 'motorcycle' });
        }
        sendTokenResponse(user, 201, res);
    } catch (err) { next(err); }
};

// @desc  Login
// @route POST /api/auth/login
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            throw new AppError('Invalid email or password.', 401);
        }
        if (!user.isActive) throw new AppError('Account deactivated.', 403);

        sendTokenResponse(user, 200, res);
    } catch (err) { next(err); }
};

// @desc  Logout (clear cookie)
// @route POST /api/auth/logout
export const logout = (req, res) => {
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

// @desc  Get current logged-in user
// @route GET /api/auth/me
export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        res.status(200).json({ success: true, user });
    } catch (err) { next(err); }
};

// @desc  Forgot password — send reset token (placeholder)
// @route POST /api/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) throw new AppError('No user with that email.', 404);
        // TODO: generate reset token, send email
        res.status(200).json({ success: true, message: 'Password reset email sent (not yet implemented).' });
    } catch (err) { next(err); }
};

// @desc  Reset password
// @route PUT /api/auth/reset-password/:token
export const resetPassword = async (req, res, next) => {
    try {
        // TODO: verify token, update password
        res.status(200).json({ success: true, message: 'Password reset (not yet implemented).' });
    } catch (err) { next(err); }
};
