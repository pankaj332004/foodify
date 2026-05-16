import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import { AppError } from '../middleware/error.middleware.js';
import { getIO } from '../config/socket.js';

/**
 * Build order items from cart (validate menu items, snapshot price/name).
 */
export const buildOrderItems = async (cartItems, restaurantId) => {
    const itemIds = cartItems.map((i) => i.menuItem);
    const menuItems = await MenuItem.find({
        _id: { $in: itemIds },
        restaurant: restaurantId,
        isAvailable: true,
    });

    if (menuItems.length !== cartItems.length) {
        throw new AppError('One or more items are unavailable or not from this restaurant.', 400);
    }

    const menuMap = new Map(menuItems.map((m) => [m._id.toString(), m]));

    return cartItems.map((cartItem) => {
        const item = menuMap.get(cartItem.menuItem.toString());
        return {
            menuItem: item._id,
            name: item.name,
            price: item.discountedPrice ?? item.price,
            quantity: cartItem.quantity,
            specialInstructions: cartItem.specialInstructions || '',
        };
    });
};

/**
 * Calculate order pricing.
 */
export const calculateOrderTotals = (items, deliveryFee = 0, taxRate = 0.05) => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
    const totalAmount = Math.round((subtotal + deliveryFee + taxAmount) * 100) / 100;
    return { subtotal, deliveryFee, taxAmount, totalAmount };
};

/**
 * Update order status and emit real-time socket event.
 */
export const updateOrderStatus = async (orderId, newStatus, actorId) => {
    const order = await Order.findById(orderId);
    if (!order) throw new AppError('Order not found', 404);

    order.status = newStatus;
    if (newStatus === 'delivered') order.deliveredAt = new Date();
    if (newStatus === 'cancelled') order.cancelledAt = new Date();

    await order.save();

    // Real-time update to all parties in this order's room
    getIO().to(`order:${orderId}`).emit('order:statusUpdated', {
        orderId,
        status: newStatus,
    });

    // Also notify via user room (fallback — customer may not be in order room)
    getIO().to(`user:${order.customer}`).emit('order:statusUpdated', {
        orderId: orderId.toString(),
        status: newStatus,
    });

    // Also notify restaurant room
    getIO().to(`restaurant:${order.restaurant}`).emit('order:statusUpdated', {
        orderId,
        status: newStatus,
    });

    return order;
};
