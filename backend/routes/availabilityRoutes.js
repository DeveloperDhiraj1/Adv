import express from 'express';
import { setAvailability, getExpertAvailability, getMyAvailability } from '../controllers/availabilityController.js';
import { verifyToken } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/set', verifyToken, setAvailability); 
router.get('/my', verifyToken, getMyAvailability);
router.get('/:expertId', getExpertAvailability);  

export default router;