/**
 * authorize(...roles) — Role-Based Access Control (RBAC)
 *
 * Must be used AFTER the `protect` middleware so that req.user is available.
 *
 * Usage:
 *   router.delete('/restaurant/:id',
 *     protect,
 *     authorize('admin', 'restaurant_owner'),
 *     deleteRestaurant
 *   );
 */
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated.',
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role(s): ${roles.join(', ')}. Your role: ${req.user.role}.`,
            });
        }

        next();
    };
};

// Convenience shortcuts for common role checks
export const isAdmin = authorize('admin');
export const isRestaurantOwner = authorize('restaurant_owner');
export const isDeliveryPartner = authorize('delivery_partner');
export const isCustomer = authorize('customer');
export const isAdminOrOwner = authorize('admin', 'restaurant_owner');
