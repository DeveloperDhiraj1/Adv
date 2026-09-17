import express from 'express';
import { verifyToken } from '../middlewares/authMiddlewares.js';
import { getFavorites, addFavorite, removeFavorite } from '../controllers/favoriteController.js';

const router = express.Router();
router.get('/', verifyToken, getFavorites);
router.post('/:serviceId', verifyToken, addFavorite);
router.delete('/:serviceId', verifyToken, removeFavorite);
export default router;
