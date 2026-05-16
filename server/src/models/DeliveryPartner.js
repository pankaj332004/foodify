import mongoose from 'mongoose';

const deliveryPartnerSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,   // one profile per user
        },
        vehicleType: {
            type: String,
            enum: ['bicycle', 'motorcycle', 'car', 'scooter'],
            required: true,
        },
        vehicleNumber: {
            type: String,
            trim: true,
            uppercase: true,
        },
        licenseNumber: {
            type: String,
            trim: true,
        },

        // Real-time availability
        isAvailable: { type: Boolean, default: false },

        // GeoJSON point for live location tracking via Socket.io
        currentLocation: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
            },
            coordinates: {
                type: [Number],   // [longitude, latitude]
                default: [0, 0],
            },
        },

        // Ratings
        rating: { type: Number, default: 0, min: 0, max: 5 },
        totalRatings: { type: Number, default: 0 },

        totalDeliveries: { type: Number, default: 0 },

        // Current active order (null when free)
        activeOrder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            default: null,
        },

        isVerified: { type: Boolean, default: false }, // admin verification
        isActive: { type: Boolean, default: true },

        // Bank / payout details
        bankAccount: {
            accountNumber: { type: String, select: false },
            ifscCode: { type: String, select: false },
            accountHolder: { type: String },
        },
    },
    { timestamps: true }
);

// 2dsphere index for geospatial queries (find nearest partner)
deliveryPartnerSchema.index({ currentLocation: '2dsphere' });
deliveryPartnerSchema.index({ isAvailable: 1 });

const DeliveryPartner = mongoose.model('DeliveryPartner', deliveryPartnerSchema);
export default DeliveryPartner;
