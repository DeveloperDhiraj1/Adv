import express from 'express';
import {
  createService,
  getServices,
  getServiceById,
  getMyServices,
  updateService,
  deleteService
} from '../controllers/serviceController.js';
import { verifyToken } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/', verifyToken, createService);
router.get('/', getServices);
router.get('/my-services', verifyToken, getMyServices); // must be declared before '/:id'
router.get('/:id', getServiceById);
router.put('/:id', verifyToken, updateService);
router.delete('/:id', verifyToken, deleteService);

export default router;
