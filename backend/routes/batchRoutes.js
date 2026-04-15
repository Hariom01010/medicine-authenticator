import express from 'express';
import { createBatch, updateBatch, getBatch, verifyBatch, tamperBatch } from '../controllers/batchController.js';

const router = express.Router();

router.post('/', createBatch);
router.post('/:id/update', updateBatch);
router.get('/:id', getBatch);
router.get('/:id/verify', verifyBatch);
router.post('/:id/tamper', tamperBatch);

export default router;
