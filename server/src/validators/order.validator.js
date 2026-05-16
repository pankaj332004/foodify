// Order request validators

export const validateCreateOrder = (req, res, next) => {
    const { restaurantId, items, deliveryAddress, paymentMethod } = req.body;
    const errors = [];

    if (!restaurantId) errors.push('restaurantId is required.');

    if (!items || !Array.isArray(items) || items.length === 0)
        errors.push('At least one item is required.');
    else {
        items.forEach((item, idx) => {
            if (!item.menuItem) errors.push(`Item ${idx + 1}: menuItem id is required.`);
            if (!item.quantity || item.quantity < 1)
                errors.push(`Item ${idx + 1}: quantity must be at least 1.`);
        });
    }

    if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city)
        errors.push('deliveryAddress with street and city is required.');

    const allowed = ['card', 'upi', 'netbanking', 'wallet', 'cod', 'razorpay'];
    if (!paymentMethod || !allowed.includes(paymentMethod))
        errors.push(`paymentMethod must be one of: ${allowed.join(', ')}.`);

    if (errors.length > 0) {
        return res.status(422).json({ success: false, errors, message: errors.join(', ') });
    }
    next();
};
