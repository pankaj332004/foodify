import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * protect — verifies JWT and attaches req.user
 * Expects: Authorization: Bearer <token>
 */
export const protect = async (req, res, next) => {
    try {
        // 1. Extract token
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer ')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated. Please log in.',
            });
        }

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Check user still exists (handles deleted accounts)
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User no longer exists.',
            });
        }

        // 4. Check account is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been deactivated.',
            });
        }

        req.user = user;
        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Invalid token.' });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token expired. Please log in again.' });
        }
        next(err);
    }
};

/**
 * optionalAuth — like protect but does NOT block unauthenticated requests.
 * Sets req.user if a valid token is present, otherwise continues as guest.
 * Useful for public routes that behave differently when logged in.
 */
export const optionalAuth = async (req, res, next) => {
    try {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer ')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) return next();

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (user && user.isActive) req.user = user;

        next();
    } catch {
        // Token invalid or expired — just continue as guest
        next();
    }
};
