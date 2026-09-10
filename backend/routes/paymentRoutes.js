import express from 'express';
import { createRazorpayOrder, verifyRazorpayPayment, getUserPayments } from '../controllers/paymentController.js';
import { verifyToken } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/create-order', verifyToken, createRazorpayOrder);
router.post('/verify-payment', verifyToken, verifyRazorpayPayment);
router.get('/my-payments', verifyToken, getUserPayments);

export default router;