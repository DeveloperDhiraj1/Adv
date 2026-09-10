import express from 'express';

import {
  createCallSession,
  startCallSession,
  endCallSession,
  getMyCallSessions
} from '../controllers/callSessionController.js';

import { verifyToken } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/', verifyToken, createCallSession);

router.get(
  '/my-sessions',
  verifyToken,
  getMyCallSessions
);

router.patch(
  '/:bookingId/start',
  verifyToken,
  startCallSession
);

router.patch(
  '/:bookingId/end',
  verifyToken,
  endCallSession
);

export default router;