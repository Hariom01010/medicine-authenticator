import Batch from '../models/Batch.js';
import { Blockchain } from '../services/blockchain.js';

// @desc    Initialize a new medicine batch (Creates Genesis Block)
// @route   POST /api/batches
// @access  Private (Manufacturer only)
export const createBatch = async (req, res) => {
    try {
        const { medicineName, manufacturer } = req.body;
        if (!medicineName || !manufacturer) {
            return res.status(400).json({ success: false, message: 'Please provide medicineName and manufacturer' });
        }

        // Initialize a fresh blockchain for this specific batch
        const medicineChain = new Blockchain();
        
        // Add genesis info
        medicineChain.chain[0].data = {
            event: 'Batch Created',
            medicineName,
            manufacturer,
            creatorEmail: req.user.email
        };
        // Re-calculate hash for the genesis block
        medicineChain.chain[0].hash = medicineChain.chain[0].calculateHash();

        const newBatch = await Batch.create({
            medicineName,
            manufacturer,
            status: 'CREATED',
            creator: req.user._id,
            organization: req.user.organization,
            chain: medicineChain.chain
        });

        res.status(201).json({ success: true, data: newBatch });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add a tracking update to an existing batch
// @route   POST /api/batches/:id/update
// @access  Private (Role-based)
export const updateBatch = async (req, res) => {
    try {
        const { id } = req.params;
        const { updateData, nextStatus } = req.body; 

        if (!updateData || !nextStatus) {
            return res.status(400).json({ success: false, message: 'Missing updateData or nextStatus in request body' });
        }

        const batch = await Batch.findById(id);
        if (!batch) {
            return res.status(404).json({ success: false, message: 'Batch not found' });
        }

        // --- Role & State Machine Logic ---
        const userRole = req.user.role;
        const currentStatus = batch.status;

        let isAuthorized = false;

        // 1. Transporter: CREATED -> IN_TRANSIT or WAREHOUSE -> IN_TRANSIT
        if (userRole === 'Transporter') {
            if ((currentStatus === 'CREATED' || currentStatus === 'WAREHOUSE') && nextStatus === 'IN_TRANSIT') {
                isAuthorized = true;
            }
        }
        // 2. Warehouse: IN_TRANSIT -> WAREHOUSE
        else if (userRole === 'Warehouse') {
            if (currentStatus === 'IN_TRANSIT' && nextStatus === 'WAREHOUSE') {
                isAuthorized = true;
            }
        }
        // 3. Pharmacist: IN_TRANSIT -> PHARMACY or PHARMACY -> SOLD
        else if (userRole === 'Pharmacist') {
            if (currentStatus === 'IN_TRANSIT' && nextStatus === 'PHARMACY') {
                isAuthorized = true;
            } else if (currentStatus === 'PHARMACY' && nextStatus === 'SOLD') {
                isAuthorized = true;
            }
        }
        // 4. Admin can do anything (optional)
        else if (userRole === 'Admin') {
            isAuthorized = true;
        }

        if (!isAuthorized) {
            return res.status(403).json({ 
                success: false, 
                message: `User with role ${userRole} is not authorized to transition batch from ${currentStatus} to ${nextStatus}` 
            });
        }

        // Reconstitute chain into our Blockchain service to get proper methods
        const medicineChain = new Blockchain(batch.chain);

        // Add the new block
        medicineChain.addBlock({
            ...updateData,
            statusChange: `${currentStatus} -> ${nextStatus}`,
            updatedBy: req.user.name,
            role: userRole
        });

        // Update the database
        batch.chain = medicineChain.chain;
        batch.status = nextStatus;
        await batch.save();

        res.status(200).json({ success: true, data: batch });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ success: false, message: 'Batch not found' });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get full timeline history for a batch
// @route   GET /api/batches/:id
// @access  Public
export const getBatch = async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id);
        if (!batch) {
            return res.status(404).json({ success: false, message: 'Batch not found' });
        }

        res.status(200).json({ success: true, data: batch });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ success: false, message: 'Batch not found' });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Verify the authenticity/integrity of the batch's timeline
// @route   GET /api/batches/:id/verify
// @access  Public
export const verifyBatch = async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id);
        if (!batch) {
            return res.status(404).json({ success: false, message: 'Batch not found' });
        }

        const medicineChain = new Blockchain(batch.chain);
        const isValid = medicineChain.isChainValid();

        res.status(200).json({ success: true, isValid });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ success: false, message: 'Batch not found' });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all batches (filtered by user if Manufacturer)
// @route   GET /api/batches
// @access  Private
export const getBatches = async (req, res) => {
    try {
        let query = {};
        
        // Filter by organization for multi-tenancy
        // Admin and Regulator have global auditing permissions
        if (req.user.role !== 'Admin' && req.user.role !== 'Regulator') {
            query.organization = req.user.organization;
        }

        const batches = await Batch.find(query).sort({ updatedAt: -1 }).populate('organization', 'name');
        res.status(200).json({ success: true, count: batches.length, data: batches });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Simulate a hacker tampering with the Mongo data!
// @route   POST /api/batches/:id/tamper
// @access  Private (Admin only)
export const tamperBatch = async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id);
        if (!batch) {
            return res.status(404).json({ success: false, message: 'Batch not found' });
        }

        if (batch.chain.length > 0) {
            batch.chain[0].data = { ...batch.chain[0].data, INTERCEPTED: "HACKER_TAMPERED" };
            batch.markModified('chain');
            await batch.save();
        }

        res.status(200).json({ success: true, message: "Chain maliciously tampered!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Recall a medicine batch
// @route   POST /api/batches/:id/recall
// @access  Private (Regulator Only)
export const recallBatch = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const batch = await Batch.findById(id);
        if (!batch) {
            return res.status(404).json({ success: false, message: 'Batch not found' });
        }

        if (batch.status === 'RECALLED') {
            return res.status(400).json({ success: false, message: 'Batch is already recalled' });
        }

        // Initialize blockchain service
        const medicineChain = new Blockchain(batch.chain);

        // Add the RECALL block
        medicineChain.addBlock({
            event: 'OFFICIAL_RECALL_ORDER',
            reason: reason || 'Public health safety concern',
            authority: req.user.name,
            organization: req.user.organization,
            contact: req.user.email,
            timestamp: new Date().toISOString()
        });

        // Update database
        batch.chain = medicineChain.chain;
        batch.status = 'RECALLED';
        await batch.save();

        res.status(200).json({ 
            success: true, 
            message: 'CRITICAL: Batch has been officially recalled. All verifications will now show a warning.',
            data: batch 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
