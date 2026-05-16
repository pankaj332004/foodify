import jwt from 'jsonwebtoken';

/**
 * Generate a signed JWT for a user.
 * @param {string} id  - MongoDB user _id
 * @param {string} role - user role
 * @returns {string} signed JWT
 */
export const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
};

/**
 * Attach token as an httpOnly cookie and return it in the response body.
 */
export const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id, user.role);

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    };

    res.cookie('token', token, cookieOptions).status(statusCode).json({
        success: true,
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
        },
    });
};
