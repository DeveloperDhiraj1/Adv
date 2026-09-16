import express from 'express';
import { signup, verifyFirebaseEmail, firebaseLogin, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/verify-firebase-email', verifyFirebaseEmail);
router.post('/firebase-login', firebaseLogin);
router.post('/login', login);

export default router;
