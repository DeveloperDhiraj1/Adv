import express from 'express';

import {
  filterUsers,
  filterExperts,
  filterBookings,
  filterPayments,
  filterDisputes,
  filterCallSessions,
  filterPayouts
} from '../controllers/adminFilterController.js';

import { verifyToken } from '../middlewares/authMiddlewares.js';
import { verifyAdmin } from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.get('/users', verifyToken, verifyAdmin, filterUsers);

router.get('/experts', verifyToken, verifyAdmin, filterExperts);

router.get('/bookings', verifyToken, verifyAdmin, filterBookings);

router.get('/payments', verifyToken, verifyAdmin, filterPayments);

router.get('/disputes', verifyToken, verifyAdmin, filterDisputes);

router.get(
  '/call-sessions',
  verifyToken,
  verifyAdmin,
  filterCallSessions
);

router.get('/payouts', verifyToken, verifyAdmin, filterPayouts);

export default router;