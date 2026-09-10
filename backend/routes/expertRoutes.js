import express from 'express';
import { createExpertProfile, updateExpertProfile } from '../controllers/expertController.js';
import { verifyToken } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/profile', verifyToken, createExpertProfile);
router.put('/profile', verifyToken, updateExpertProfile);

export default router;