import express from 'express';

import {
  createPayout,
  getExpertPayouts
} from '../controllers/payoutController.js';

import { verifyToken } from '../middlewares/authMiddlewares.js';
import { verifyAdmin } from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.post(
  '/',
  verifyToken,
  verifyAdmin,
  createPayout
);

router.get(
  '/my-payouts',
  verifyToken,
  getExpertPayouts
);

export default router;