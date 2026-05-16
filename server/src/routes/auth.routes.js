import express from 'express';
import {
    register, login, logout, getMe, forgotPassword, resetPassword,
} from '../controllers/auth.controllers.js';
import { protect } from '../middleware/auth.middleware.js';
import { validateRegister, validateLogin } from '../validators/auth.validator.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

export default router;
