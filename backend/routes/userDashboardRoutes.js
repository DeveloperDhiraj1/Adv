import express from 'express';
import { getUserDashboard, updateUserProfile } from '../controllers/userDashboardController.js';
import { verifyToken } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/', verifyToken, getUserDashboard); 
router.put('/profile', verifyToken, updateUserProfile);

export default router;