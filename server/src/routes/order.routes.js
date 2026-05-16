import express from 'express';
import {
    placeOrder, getMyOrders, getOrder, updateStatus,
    cancelOrder, getRestaurantOrders, verifyPayment, deleteOrderHistory
} from '../controllers/order.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { isAdminOrOwner } from '../middleware/role.middleware.js';
import { validateCreateOrder } from '../validators/order.validator.js';

const router = express.Router();

router.use(protect);   // all order routes require auth

router.post('/', validateCreateOrder, placeOrder);
router.post('/verify-payment', verifyPayment);
router.get('/my', getMyOrders);
router.get('/restaurant', isAdminOrOwner, getRestaurantOrders);
router.get('/:id', getOrder);
router.put('/:id/status', isAdminOrOwner, updateStatus);
router.put('/:id/cancel', cancelOrder);
router.delete('/:id/history', deleteOrderHistory);

export default router;
