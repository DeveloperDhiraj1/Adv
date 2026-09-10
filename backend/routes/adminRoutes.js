import express from 'express';
import {
  getAllUsers,
  getAllExperts,
  getAdminStats,
  deactivateUser,
  activateUser,
  verifyExpert,
  rejectExpert,
  getDisputes,
  resolveDispute,
  getTransactions
} from '../controllers/adminController.js';
import { verifyToken } from '../middlewares/authMiddlewares.js';
import { verifyAdmin } from '../middlewares/adminMiddleware.js';

const router = express.Router();

// Dashboard stats
router.get('/stats', verifyToken, verifyAdmin, getAdminStats);

// User management
router.get('/users', verifyToken, verifyAdmin, getAllUsers);
router.patch('/users/:userId/deactivate', verifyToken, verifyAdmin, deactivateUser);
router.patch('/users/:userId/activate', verifyToken, verifyAdmin, activateUser);

// Expert management
router.get('/experts', verifyToken, verifyAdmin, getAllExperts);
router.patch('/experts/:expertId/verify', verifyToken, verifyAdmin, verifyExpert);
router.patch('/experts/:expertId/reject', verifyToken, verifyAdmin, rejectExpert);

// Disputes
router.get('/disputes', verifyToken, verifyAdmin, getDisputes);
router.patch('/disputes/:disputeId/resolve', verifyToken, verifyAdmin, resolveDispute);

// Transactions
router.get('/transactions', verifyToken, verifyAdmin, getTransactions);

export default router;