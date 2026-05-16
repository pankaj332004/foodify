import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
    {
        menuItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuItem',
            required: true,
        },
        // Snapshot the name & price at order time (in case menu updates later)
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        specialInstructions: {
            type: String,
            default: '',
        },
    },
    { _id: true }
);

const orderSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: true,
        },
        items: [orderItemSchema],

        deliveryAddress: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true },
            coordinates: {
                lat: { type: Number },
                lng: { type: Number },
            },
        },

        subtotal: { type: Number, required: true },   // items total
        deliveryFee: { type: Number, default: 0 },
        taxAmount: { type: Number, default: 0 },
        totalAmount: { type: Number, required: true },   // grand total

        status: {
            type: String,
            enum: [
                'pending',          // just placed
                'confirmed',        // restaurant accepted
                'preparing',        // kitchen working
                'ready_for_pickup', // waiting for delivery partner
                'out_for_delivery', // on the way
                'delivered',        // completed
                'cancelled',        // cancelled
            ],
            default: 'pending',
        },

        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded'],
            default: 'pending',
        },

        payment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Payment',
        },

        deliveryPartner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DeliveryPartner',
            default: null,
        },

        notes: { type: String, default: '' },
        estimatedDeliveryTime: { type: Number, default: 30 }, // in minutes
        deliveredAt: { type: Date },
        cancelledAt: { type: Date },
        cancellationReason: { type: String },
    },
    { timestamps: true }
);

orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ restaurant: 1, status: 1 });
orderSchema.index({ deliveryPartner: 1, status: 1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
