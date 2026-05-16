import express from 'express';
import {
    registerPartner, getPartnerProfile, toggleAvailability,
    getActiveOrder, markDelivered, getAllPartners, verifyPartner,
} from '../controllers/delivery.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { isAdmin, isDeliveryPartner } from '../middleware/role.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/register', isDeliveryPartner, registerPartner);
router.get('/profile', isDeliveryPartner, getPartnerProfile);
router.put('/toggle-availability', isDeliveryPartner, toggleAvailability);
router.get('/active-order', isDeliveryPartner, getActiveOrder);
router.put('/complete/:orderId', isDeliveryPartner, markDelivered);

// Admin
router.get('/all', isAdmin, getAllPartners);
router.put('/:partnerId/verify', isAdmin, verifyPartner);

export default router;
