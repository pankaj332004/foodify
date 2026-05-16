import express from 'express';
import {
    createIntent, confirm, stripeWebhook, refund, getPaymentHistory,
} from '../controllers/payment.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/role.middleware.js';

const router = express.Router();

// Stripe webhook MUST receive the raw body — handled in app.js before json()
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

router.use(protect);

router.post('/create-intent', createIntent);
router.post('/confirm', confirm);
router.get('/history', getPaymentHistory);
router.post('/:paymentId/refund', isAdmin, refund);

export default router;
