import express from 'express';
import { login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Admin login
router.post('/login', login);

// Session check
router.get('/me', protect, getMe);

export default router;
