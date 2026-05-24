import express from 'express';
import { getConversations, sendMessage } from '../controllers/chatController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.get('/conversations', getConversations);
router.post('/', sendMessage);

export default router;
