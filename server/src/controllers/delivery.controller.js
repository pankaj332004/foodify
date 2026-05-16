import DeliveryPartner from '../models/DeliveryPartner.js';
import Order from '../models/Order.js';
import { completeDelivery } from '../services/delivery.service.js';
import { AppError } from '../middleware/error.middleware.js';

// @desc  Register as delivery partner (creates profile linked to user)
// @route POST /api/delivery/register
export const registerPartner = async (req, res, next) => {
    try {
        const existing = await DeliveryPartner.findOne({ user: req.user._id });
        if (existing) throw new AppError('Delivery partner profile already exists.', 409);

        const partner = await DeliveryPartner.create({ ...req.body, user: req.user._id });
        res.status(201).json({ success: true, partner });
    } catch (err) { next(err); }
};

// @desc  Get own partner profile
// @route GET /api/delivery/profile
export const getPartnerProfile = async (req, res, next) => {
    try {
        const partner = await DeliveryPartner.findOne({ user: req.user._id })
            .populate('user', 'name phone email')
            .populate('activeOrder');
        if (!partner) throw new AppError('Profile not found', 404);
        res.status(200).json({ success: true, partner });
    } catch (err) { next(err); }
};

// @desc  Toggle availability
// @route PUT /api/delivery/toggle-availability
export const toggleAvailability = async (req, res, next) => {
    try {
        const partner = await DeliveryPartner.findOne({ user: req.user._id });
        if (!partner) throw new AppError('Profile not found', 404);
        if (partner.activeOrder) throw new AppError('Cannot go offline while on an active delivery.', 400);

        partner.isAvailable = !partner.isAvailable;
        await partner.save();
        res.status(200).json({ success: true, isAvailable: partner.isAvailable });
    } catch (err) { next(err); }
};

// @desc  Get partner's active order
// @route GET /api/delivery/active-order
export const getActiveOrder = async (req, res, next) => {
    try {
        const partner = await DeliveryPartner.findOne({ user: req.user._id });
        if (!partner || !partner.activeOrder) {
            return res.status(200).json({ success: true, order: null });
        }
        const order = await Order.findById(partner.activeOrder)
            .populate('customer', 'name phone')
            .populate('restaurant', 'name address phone');
        res.status(200).json({ success: true, order });
    } catch (err) { next(err); }
};

// @desc  Mark order as delivered
// @route PUT /api/delivery/complete/:orderId
export const markDelivered = async (req, res, next) => {
    try {
        const partner = await DeliveryPartner.findOne({ user: req.user._id });
        if (!partner) throw new AppError('Partner profile not found', 404);

        const order = await completeDelivery(req.params.orderId, partner._id);
        res.status(200).json({ success: true, order });
    } catch (err) { next(err); }
};

// @desc  Get all delivery partners  [admin]
// @route GET /api/delivery/all
export const getAllPartners = async (req, res, next) => {
    try {
        const partners = await DeliveryPartner.find()
            .populate('user', 'name email phone')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, partners });
    } catch (err) { next(err); }
};

// @desc  Verify a delivery partner  [admin]
// @route PUT /api/delivery/:partnerId/verify
export const verifyPartner = async (req, res, next) => {
    try {
        const partner = await DeliveryPartner.findByIdAndUpdate(
            req.params.partnerId,
            { isVerified: true },
            { new: true }
        );
        if (!partner) throw new AppError('Partner not found', 404);
        res.status(200).json({ success: true, partner });
    } catch (err) { next(err); }
};
