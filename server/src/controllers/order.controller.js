import Order from '../models/Order.js';
import Restaurant from '../models/Restaurant.js';
import { buildOrderItems, calculateOrderTotals, updateOrderStatus } from '../services/order.service.js';
import { createCODPayment, createRazorpayOrder, verifyRazorpayPayment } from '../services/payment.service.js';
import { findNearestPartner, assignDeliveryPartner } from '../services/delivery.service.js';
import { calculateDistance, calculateDistanceByPincode } from '../utils/calculateDistance.js';
import { AppError } from '../middleware/error.middleware.js';
import { getIO } from '../config/socket.js';

// @desc  Place a new order
// @route POST /api/orders
export const placeOrder = async (req, res, next) => {
    try {
        const { restaurantId, items, deliveryAddress, paymentMethod, notes } = req.body;

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant || !restaurant.isActive) throw new AppError('Restaurant not available.', 400);
        if (!restaurant.isOpen) throw new AppError('Restaurant is currently closed.', 400);

        // Calculate distance-based delivery fee ($1 per km, min $2)
        let deliveryFee = 2; // Default/Min fee
        let distance = 0;

        if (restaurant.address?.coordinates && deliveryAddress.coordinates) {
            distance = calculateDistance(
                restaurant.address.coordinates.lat,
                restaurant.address.coordinates.lng,
                deliveryAddress.coordinates.lat,
                deliveryAddress.coordinates.lng
            );
        } else if (restaurant.address?.pincode && deliveryAddress.pincode) {
            // Fallback to pincode-based distance
            distance = calculateDistanceByPincode(restaurant.address.pincode, deliveryAddress.pincode);
        }

        if (distance > 0) {
            if (distance > restaurant.deliveryRadius) {
                throw new AppError(`Order not possible. You are beyond the delivery radius of ${restaurant.deliveryRadius}km (Current distance: ${distance}km)`, 400);
            }
            deliveryFee = Math.max(2, Math.round(distance * 1));
        }

        const orderItems = await buildOrderItems(items, restaurantId);
        const totals = calculateOrderTotals(orderItems, deliveryFee);

        const order = await Order.create({
            customer: req.user._id,
            restaurant: restaurantId,
            items: orderItems,
            deliveryAddress,
            notes,
            paymentMethod,
            estimatedDeliveryTime: restaurant.deliveryTime,
            ...totals,
        });

        // Handle COD payment immediately
        // Handle payment
        let paymentResponse = null;
        if (paymentMethod === 'cod') {
            const payment = await createCODPayment(order._id, req.user._id, order.totalAmount);
            order.payment = payment._id;
            await order.save();
        } else if (paymentMethod === 'razorpay') {
            paymentResponse = await createRazorpayOrder(order._id, req.user._id);
            order.payment = paymentResponse.paymentId;
            await order.save();
        }

        // Notify restaurant via socket
        getIO().to(`restaurant:${restaurantId}`).emit('order:new', {
            orderId: order._id,
            customerName: req.user.name,
            totalAmount: order.totalAmount,
        });

        res.status(201).json({ success: true, order, payment: paymentResponse });
    } catch (err) { next(err); }
};

// @desc  Get customer's own orders
// @route GET /api/orders/my
export const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ customer: req.user._id })
            .populate('restaurant', 'name coverImage address')
            .populate({
                path: 'deliveryPartner',
                populate: { path: 'user', select: 'name phone' }
            })
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (err) { next(err); }
};

// @desc  Get single order details
// @route GET /api/orders/:id
export const getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('restaurant', 'name address phone coverImage')
            .populate({
                path: 'deliveryPartner',
                populate: { path: 'user', select: 'name phone' }
            })
            .populate('payment');

        if (!order) throw new AppError('Order not found', 404);

        // Only customer, restaurant owner, delivery partner, or admin can view
        const isCustomer = order.customer.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        if (!isCustomer && !isAdmin) throw new AppError('Not authorized.', 403);

        res.status(200).json({ success: true, order });
    } catch (err) { next(err); }
};

// @desc  Restaurant updates order status (confirm, prepare, ready)
// @route PUT /api/orders/:id/status  [restaurant_owner | admin]
export const updateStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const order = await updateOrderStatus(req.params.id, status);

        // When ready, auto-assign nearest delivery partner
        if (status === 'ready_for_pickup') {
            const Restaurant = (await import('../models/Restaurant.js')).default;
            const restaurant = await Restaurant.findById(order.restaurant);
            if (restaurant?.address?.coordinates) {
                const partner = await findNearestPartner(restaurant.address.coordinates);
                if (partner) await assignDeliveryPartner(order._id, partner._id);
            }
        }

        // Fetch updated order with population
        const updatedOrder = await Order.findById(order._id)
            .populate('restaurant', 'name address phone coverImage')
            .populate({
                path: 'deliveryPartner',
                populate: { path: 'user', select: 'name phone' }
            })
            .populate('payment');

        res.status(200).json({ success: true, order: updatedOrder });
    } catch (err) { next(err); }
};

// @desc  Cancel an order
// @route PUT /api/orders/:id/cancel
export const cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) throw new AppError('Order not found', 404);

        const cancellableStatuses = ['pending', 'confirmed'];
        if (!cancellableStatuses.includes(order.status)) {
            throw new AppError('Order cannot be cancelled at this stage.', 400);
        }

        order.status = 'cancelled';
        order.cancelledAt = new Date();
        order.cancellationReason = req.body.reason || 'Cancelled by customer';
        await order.save();

        res.status(200).json({ success: true, order });
    } catch (err) { next(err); }
};

// @desc  Get all orders for a restaurant  [restaurant_owner]
// @route GET /api/orders/restaurant
export const getRestaurantOrders = async (req, res, next) => {
    try {
        const Restaurant = (await import('../models/Restaurant.js')).default;
        const restaurant = await Restaurant.findOne({ owner: req.user._id });
        if (!restaurant) {
            return res.status(404).json({ success: false, message: 'Restaurant not found' });
        }

        const { status } = req.query;
        const query = { restaurant: restaurant._id };
        if (status) query.status = status;

        const orders = await Order.find(query)
            .populate('customer', 'name phone')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, orders });
    } catch (err) { next(err); }
};

// @desc  Verify Razorpay Payment
// @route POST /api/orders/verify-payment
export const verifyPayment = async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const payment = await verifyRazorpayPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);

        res.status(200).json({ success: true, message: 'Payment verified successfully', payment });
    } catch (err) { next(err); }
};

// @desc  Delete order from history
// @route DELETE /api/orders/:id/history
export const deleteOrderHistory = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) throw new AppError('Order not found', 404);

        if (order.customer.toString() !== req.user._id.toString()) {
            throw new AppError('Not authorized to delete this order history.', 403);
        }

        await Order.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, message: 'Order removed from history' });
    } catch (err) { next(err); }
};
