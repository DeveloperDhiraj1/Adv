import express from 'express';
import { createCategory, getAllCategories, deleteCategory } from '../controllers/ExpertcategoryController.js';
import { verifyToken } from '../middlewares/authMiddlewares.js';
import { verifyAdmin } from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.get('/', getAllCategories); 
router.post('/add', verifyToken, verifyAdmin, createCategory); 
router.delete('/:id', verifyToken, verifyAdmin, deleteCategory); 

export default router;