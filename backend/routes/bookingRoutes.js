import express from 'express';
import { createBooking, getUserBookings, addMeetingLink } from '../controllers/bookingController.js';
import { verifyToken } from '../middlewares/authMiddlewares.js';

const router = express.Router();


router.post('/', verifyToken, createBooking);
router.get('/my-bookings', verifyToken, getUserBookings);
router.patch('/:bookingId/meeting-link', verifyToken, addMeetingLink);

export default router;