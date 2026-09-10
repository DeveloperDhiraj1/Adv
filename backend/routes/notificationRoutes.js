import express from 'express';

import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '../controllers/notificationController.js';

import { verifyToken } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/', verifyToken, getMyNotifications);
router.patch('/:id/read', verifyToken, markNotificationAsRead);
router.patch('/read-all', verifyToken, markAllNotificationsAsRead);

export default router;