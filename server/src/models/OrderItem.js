import mongoose from 'mongoose';

// OrderItem is embedded directly inside Order as a sub-schema.
// This standalone model exists if you ever want to query order items independently.
const orderItemSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
        },
        menuItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuItem',
            required: true,
        },
        name: { type: String, required: true },   // snapshot at order time
        price: { type: Number, required: true },   // snapshot at order time
        quantity: { type: Number, required: true, min: 1 },
        specialInstructions: { type: String, default: '' },
    },
    { timestamps: true }
);

orderItemSchema.index({ order: 1 });

const OrderItem = mongoose.model('OrderItem', orderItemSchema);
export default OrderItem;