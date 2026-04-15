import express from 'express';
import { createOrganization, getOrganizations } from '../controllers/organizationController.js';
import { protect, authorize } from '../services/authMiddleware.js';

const router = express.Router();

router.get('/', getOrganizations);
router.post('/', protect, authorize('Admin'), createOrganization);

export default router;
