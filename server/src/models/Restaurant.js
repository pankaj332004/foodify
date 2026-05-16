import mongoose from 'mongoose';

const operatingHoursSchema = new mongoose.Schema({
    day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        required: true,
    },
    open: { type: String, required: true }, // e.g. "09:00"
    close: { type: String, required: true }, // e.g. "22:00"
    isClosed: { type: Boolean, default: false },
}, { _id: false });

const restaurantSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Restaurant name is required'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
        cuisineTypes: [{
            type: String,
            trim: true,
        }],
        address: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true },
            coordinates: {
                lat: { type: Number },
                lng: { type: Number },
            },
        },
        phone: { type: String, trim: true },
        email: { type: String, lowercase: true, trim: true },

        images: [{ type: String }],   // gallery images
        coverImage: { type: String, default: '' },

        isOpen: { type: Boolean, default: false },
        operatingHours: [operatingHoursSchema],

        // Delivery settings
        deliveryTime: { type: Number, default: 30 }, // in minutes
        minOrderAmount: { type: Number, default: 0 },
        deliveryFee: { type: Number, default: 0 },
        deliveryRadius: { type: Number, default: 10 }, // in km

        // Ratings (auto-computed, updated when a review is saved)
        rating: { type: Number, default: 0, min: 0, max: 5 },
        totalRatings: { type: Number, default: 0 },

        isVerified: { type: Boolean, default: false }, // admin verification
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

restaurantSchema.index({ 'address.city': 1 });
restaurantSchema.index({ cuisineTypes: 1 });
restaurantSchema.index({ rating: -1 });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;
