import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import stripe from '../config/stripe.js';
import razorpay from '../config/razorpay.js';
import crypto from 'crypto';
import { AppError } from '../middleware/error.middleware.js';

/**
 * Create a Stripe PaymentIntent for card/online payments.
 */
export const createPaymentIntent = async (orderId, customerId) => {
    if (!stripe) throw new AppError('Stripe is not configured on this server.', 503);

    const order = await Order.findById(orderId);
    if (!order) throw new AppError('Order not found', 404);

    // Amount in the smallest currency unit (cents for USD)
    const amountInCents = Math.round(order.totalAmount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'usd',
        metadata: {
            orderId: orderId.toString(),
            customerId: customerId.toString(),
        },
    });

    // Create a pending Payment record
    const payment = await Payment.create({
        order: orderId,
        customer: customerId,
        amount: order.totalAmount,
        currency: 'USD',
        method: 'card',
        status: 'pending',
        stripePaymentIntentId: paymentIntent.id,
    });

    return { clientSecret: paymentIntent.client_secret, paymentId: payment._id };
};

/**
 * Confirm a payment after Stripe webhook or manual confirmation.
 */
export const confirmPayment = async (stripePaymentIntentId) => {
    const payment = await Payment.findOne({ stripePaymentIntentId });
    if (!payment) throw new AppError('Payment record not found', 404);

    payment.status = 'completed';
    payment.paidAt = new Date();
    await payment.save();

    // Update linked order payment status
    await Order.findByIdAndUpdate(payment.order, { paymentStatus: 'paid' });

    return payment;
};

/**
 * Process Cash on Delivery — create a payment record immediately.
 */
export const createCODPayment = async (orderId, customerId, amount) => {
    const payment = await Payment.create({
        order: orderId,
        customer: customerId,
        amount,
        currency: 'USD',
        method: 'cod',
        status: 'pending',  // becomes 'completed' on delivery
    });

    return payment;
};

/**
 * Issue a refund for a cancelled order.
 */
export const refundPayment = async (paymentId) => {
    const payment = await Payment.findById(paymentId);
    if (!payment) throw new AppError('Payment not found', 404);

    if (payment.method === 'card' && stripe && payment.stripeChargeId) {
        await stripe.refunds.create({ charge: payment.stripeChargeId });
    }

    payment.status = 'refunded';
    payment.refundedAt = new Date();
    payment.refundAmount = payment.amount;
    await payment.save();

    return payment;
};

/**
 * Create a Razorpay Order for online payments.
 */
export const createRazorpayOrder = async (orderId, customerId) => {
    const order = await Order.findById(orderId);
    if (!order) throw new AppError('Order not found', 404);

    // Amount in the smallest currency unit (cents for USD)
    const amountInCents = Math.round(order.totalAmount * 100);

    const options = {
        amount: amountInCents,
        currency: 'USD',
        receipt: orderId.toString(),
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Create a pending Payment record
    const payment = await Payment.create({
        order: orderId,
        customer: customerId,
        amount: order.totalAmount,
        currency: 'USD',
        method: 'razorpay',
        status: 'pending',
        razorpayOrderId: razorpayOrder.id,
    });

    return {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        paymentId: payment._id,
    };
};

/**
 * Verify Razorpay payment signature.
 */
export const verifyRazorpayPayment = async (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!payment) throw new AppError('Payment record not found', 404);

    const secret = process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder';
    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature !== razorpay_signature) {
        payment.status = 'failed';
        payment.failureReason = 'Signature mismatch';
        await payment.save();
        await Order.findByIdAndUpdate(payment.order, { paymentStatus: 'failed' });
        throw new AppError('Invalid payment signature', 400);
    }

    payment.status = 'completed';
    payment.paidAt = new Date();
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    await payment.save();

    // Update linked order payment status
    await Order.findByIdAndUpdate(payment.order, { paymentStatus: 'paid' });

    return payment;
};
