// Restaurant request validators

export const validateCreateRestaurant = (req, res, next) => {
    // Parse fields if they come from FormData as strings
    if (typeof req.body.address === 'string') {
        try { req.body.address = JSON.parse(req.body.address); } catch (e) { }
    }
    if (typeof req.body.cuisineTypes === 'string') {
        try { req.body.cuisineTypes = JSON.parse(req.body.cuisineTypes); } catch (e) {
            req.body.cuisineTypes = req.body.cuisineTypes.split(',').map(c => c.trim()).filter(Boolean);
        }
    }

    const { name, address, phone } = req.body;
    console.log('[DEBUG] Create Restaurant Payload:', req.body);
    const errors = [];

    if (!name || name.trim().length < 2)
        errors.push('Restaurant name must be at least 2 characters.');

    if (!address || !address.street || !address.city || !address.state || !address.pincode)
        errors.push('Full address (street, city, state, pincode) is required. Got: ' + JSON.stringify(address));

    if (phone && phone.trim() !== '' && !/^\d{10}$/.test(phone))
        errors.push('Phone must be a valid 10-digit number.');

    if (errors.length > 0) {
        console.dir(req.body, { depth: null, colors: true });
        console.error('✅🔴 VALIDATION FAILED on /api/restaurants:', errors);
        return res.status(422).json({ success: false, errors });
    }
    next();
};

export const validateMenuItem = (req, res, next) => {
    const { name, price, category } = req.body;
    const errors = [];

    if (!name || name.trim().length < 2) errors.push('Item name is required.');
    if (price === undefined || isNaN(price) || Number(price) < 0)
        errors.push('A valid price is required.');
    if (!category || category.trim().length < 2) errors.push('Category is required.');

    if (errors.length > 0) {
        return res.status(422).json({ success: false, errors });
    }
    next();
};
