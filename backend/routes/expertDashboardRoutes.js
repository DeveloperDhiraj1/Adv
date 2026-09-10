import express from 'express';
import { getExpertDashboard } from '../controllers/expertDashboardController.js';
import { verifyToken } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/', verifyToken, getExpertDashboard); 

export default router;