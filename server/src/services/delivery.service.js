import DeliveryPartner from '../models/DeliveryPartner.js';
import Order from '../models/Order.js';
import { getIO } from '../config/socket.js';
import { calculateDistance, estimateDeliveryTime } from '../utils/calculateDistance.js';
import { AppError } from '../middleware/error.middleware.js';

/**
 * Find the nearest available delivery partner to a restaurant's location.
 */
export const findNearestPartner = async (restaurantCoords) => {
    const [lng, lat] = [restaurantCoords.lng, restaurantCoords.lat];

    const partner = await DeliveryPartner.findOne({
        isAvailable: true,
        isActive: true,
        // isVerified: true, // Temporarily disabled for development testing
        activeOrder: null,
        currentLocation: {
            $near: {
                $geometry: { type: 'Point', coordinates: [lng, lat] },
                $maxDistance: 10000, // 10 km radius
            },
        },
    }).populate('user', 'name phone');

    return partner;
};

/**
 * Assign an order to a delivery partner.
 */
export const assignDeliveryPartner = async (orderId, partnerId) => {
    const [order, partner] = await Promise.all([
        Order.findById(orderId),
        DeliveryPartner.findById(partnerId),
    ]);

    if (!order) throw new AppError('Order not found', 404);
    if (!partner) throw new AppError('Delivery partner not found', 404);

    order.deliveryPartner = partnerId;
    order.status = 'out_for_delivery';
    partner.isAvailable = false;
    partner.activeOrder = orderId;

    await Promise.all([order.save(), partner.save()]);

    // Notify customer via Socket
    try {
        getIO().to(`order:${orderId}`).emit('order:assigned', {
            orderId,
            partner: {
                id: partner._id,
                name: partner.user?.name,
            },
        });
    } catch (err) {
        console.warn('Socket.io not initialized. Skipping order:assigned notification.');
    }

    return order;
};

/**
 * Mark delivery as completed.
 */
export const completeDelivery = async (orderId, partnerId) => {
    const [order, partner] = await Promise.all([
        Order.findById(orderId),
        DeliveryPartner.findById(partnerId),
    ]);

    if (!order) throw new AppError('Order not found', 404);
    if (!partner) throw new AppError('Partner not found', 404);

    order.status = 'delivered';
    order.deliveredAt = new Date();
    partner.isAvailable = true;
    partner.activeOrder = null;
    partner.totalDeliveries += 1;

    await Promise.all([order.save(), partner.save()]);

    try {
        getIO().to(`order:${orderId}`).emit('order:delivered', { orderId });
    } catch (err) {
        console.warn('Socket.io not initialized. Skipping order:delivered notification.');
    }

    return order;
};

export { calculateDistance, estimateDeliveryTime };
