// Auth input validators (used in auth.routes.js)

export const validateRegister = (req, res, next) => {
    const { name, email, password, role } = req.body;
    const errors = [];

    if (!name || name.trim().length < 2)
        errors.push('Name must be at least 2 characters.');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email))
        errors.push('A valid email is required.');

    if (!password || password.length < 6)
        errors.push('Password must be at least 6 characters.');

    const allowedRoles = ['customer', 'restaurant_owner', 'delivery_partner'];
    if (role && !allowedRoles.includes(role))
        errors.push(`Role must be one of: ${allowedRoles.join(', ')}.`);

    if (errors.length > 0) {
        return res.status(422).json({ success: false, errors });
    }
    next();
};

export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    if (!email) errors.push('Email is required.');
    if (!password) errors.push('Password is required.');

    if (errors.length > 0) {
        return res.status(422).json({ success: false, errors });
    }
    next();
};
