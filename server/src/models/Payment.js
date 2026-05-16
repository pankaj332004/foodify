import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            default: 'USD',
            uppercase: true,
        },
        method: {
            type: String,
            enum: ['card', 'upi', 'netbanking', 'wallet', 'cod', 'razorpay'],
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending',
        },
        // Stripe-specific fields
        stripePaymentIntentId: { type: String, default: null },
        stripeChargeId: { type: String, default: null },
        // Razorpay-specific fields
        razorpayOrderId: { type: String, default: null },
        razorpayPaymentId: { type: String, default: null },
        razorpaySignature: { type: String, default: null },

        transactionId: { type: String, default: null },  // generic fallback
        failureReason: { type: String, default: null },

        refundedAt: { type: Date },
        refundAmount: { type: Number, default: 0 },
        paidAt: { type: Date },
    },
    { timestamps: true }
);

paymentSchema.index({ order: 1 });
paymentSchema.index({ customer: 1 });
paymentSchema.index({ stripePaymentIntentId: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
