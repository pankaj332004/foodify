import { createPaymentIntent, confirmPayment, refundPayment } from '../services/payment.service.js';
import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import stripe from '../config/stripe.js';
import { AppError } from '../middleware/error.middleware.js';

// @desc  Create Stripe PaymentIntent (card payments)
// @route POST /api/payments/create-intent
export const createIntent = async (req, res, next) => {
    try {
        const { orderId } = req.body;
        const result = await createPaymentIntent(orderId, req.user._id);
        res.status(200).json({ success: true, ...result });
    } catch (err) { next(err); }
};

// @desc  Confirm payment after Stripe client-side success
// @route POST /api/payments/confirm
export const confirm = async (req, res, next) => {
    try {
        const { paymentIntentId } = req.body;
        const payment = await confirmPayment(paymentIntentId);
        res.status(200).json({ success: true, payment });
    } catch (err) { next(err); }
};

// @desc  Stripe webhook handler (for server-side confirmation)
// @route POST /api/payments/webhook  [no auth — Stripe calls this]
export const stripeWebhook = async (req, res, next) => {
    try {
        if (!stripe) return res.status(503).json({ message: 'Stripe not configured.' });

        const sig = req.headers['stripe-signature'];
        let event;

        try {
            event = stripe.webhooks.constructEvent(
                req.body,   // must be raw buffer — see app.js
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch {
            return res.status(400).json({ message: 'Webhook signature verification failed.' });
        }

        if (event.type === 'payment_intent.succeeded') {
            await confirmPayment(event.data.object.id);
        }

        res.status(200).json({ received: true });
    } catch (err) { next(err); }
};

// @desc  Request a refund (admin or customer on cancelled order)
// @route POST /api/payments/:paymentId/refund  [admin]
export const refund = async (req, res, next) => {
    try {
        const payment = await refundPayment(req.params.paymentId);
        res.status(200).json({ success: true, payment });
    } catch (err) { next(err); }
};

// @desc  Get payment history for logged-in user
// @route GET /api/payments/history
export const getPaymentHistory = async (req, res, next) => {
    try {
        const payments = await Payment.find({ customer: req.user._id })
            .populate('order', 'totalAmount status createdAt')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, payments });
    } catch (err) { next(err); }
};
