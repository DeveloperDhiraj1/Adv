import express from 'express';
import {
  accessConversation,
  sendMessage,
  getMessages,
  getUserChats
} from '../controllers/chatController.js';
import { verifyToken } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/conversation', verifyToken, accessConversation);
router.get('/chats', verifyToken, getUserChats);
router.post('/message', verifyToken, sendMessage);
router.get('/messages/:conversationId', verifyToken, getMessages);

export default router;