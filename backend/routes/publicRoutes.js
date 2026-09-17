import express from 'express';
import { createContactMessage, subscribe } from '../controllers/publicController.js';

const router = express.Router();
router.post('/contact', createContactMessage);
router.post('/newsletter', subscribe);
export default router;
