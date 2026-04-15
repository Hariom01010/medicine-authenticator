import express from 'express';
import { register, login, deleteMe } from '../controllers/authController.js';
import { protect } from '../services/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.delete('/me', protect, deleteMe);

export default router;
