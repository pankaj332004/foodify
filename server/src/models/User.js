import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema({
    label: { type: String, default: 'Home' },   // Home, Work, Other
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    coordinates: {
        lat: { type: Number },
        lng: { type: Number },
    },
}, { _id: true });

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 6,
            select: false,   // never returned in queries by default
        },
        phone: {
            type: String,
            trim: true,
        },
        role: {
            type: String,
            enum: ['customer', 'restaurant_owner', 'delivery_partner', 'admin'],
            default: 'customer',
        },
        addresses: [addressSchema],
        profileImage: {
            type: String,
            default: '',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        passwordResetToken: { type: String, select: false },
        passwordResetExpires: { type: Date, select: false },
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
