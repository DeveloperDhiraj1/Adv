import express from 'express';

import {
  createDispute,
  getMyDisputes
} from '../controllers/disputeController.js';

import { verifyToken } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/', verifyToken, createDispute);

router.get(
  '/my-disputes',
  verifyToken,
  getMyDisputes
);

export default router;