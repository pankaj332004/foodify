import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
    {
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Item name is required'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: 0,
        },
        discountedPrice: {
            type: Number,
            default: null,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
            // e.g. "Starters", "Main Course", "Desserts", "Beverages"
        },
        image: {
            type: String,
            default: '',
        },
        isVeg: {
            type: Boolean,
            default: true,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        preparationTime: {
            type: Number,   // in minutes
            default: 15,
        },
        tags: [{ type: String }],   // e.g. ["spicy", "popular", "bestseller"]
    },
    { timestamps: true }
);

menuItemSchema.index({ restaurant: 1, category: 1 });
menuItemSchema.index({ restaurant: 1, isAvailable: 1 });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;
