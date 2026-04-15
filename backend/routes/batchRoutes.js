import express from 'express';
import { 
    createBatch, 
    updateBatch, 
    getBatch, 
    verifyBatch, 
    tamperBatch,
    getBatches,
    recallBatch
} from '../controllers/batchController.js';
import { protect, authorize } from '../services/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/:id', getBatch);
router.get('/:id/verify', verifyBatch);

// Private routes
router.get('/', protect, getBatches);
router.post('/', protect, authorize('Manufacturer'), createBatch);
router.post('/:id/update', protect, authorize('Transporter', 'Warehouse', 'Pharmacist', 'Admin'), updateBatch);
router.post('/:id/tamper', protect, authorize('Admin'), tamperBatch);
router.post('/:id/recall', protect, authorize('Regulator'), recallBatch);

export default router;
