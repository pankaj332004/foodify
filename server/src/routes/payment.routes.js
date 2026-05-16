import express from 'express';
import {
    createIntent, confirm, refund, getPaymentHistory,
} from '../controllers/payment.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/role.middleware.js';

const router = express.Router();

// NOTE: Stripe webhook route is mounted directly in app.js (before express.json())
// to preserve the raw body needed for signature verification.

router.use(protect);

router.post('/create-intent', createIntent);
router.post('/confirm', confirm);
router.get('/history', getPaymentHistory);
router.post('/:paymentId/refund', isAdmin, refund);

export default router;
