import express from 'express';
import { addReview, getExpertReviews } from '../controllers/reviewController.js';
import { verifyToken } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/', verifyToken, addReview);
router.get('/expert/:expertId', getExpertReviews);

export default router;