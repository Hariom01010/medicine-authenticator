import Batch from '../models/Batch.js';
import { Blockchain } from '../services/blockchain.js';

// @desc    Initialize a new medicine batch (Creates Genesis Block)
// @route   POST /api/batches
export const createBatch = async (req, res) => {
    try {
        const { medicineName, manufacturer } = req.body;
        if (!medicineName || !manufacturer) {
            return res.status(400).json({ success: false, message: 'Please provide medicineName and manufacturer' });
        }

        // Initialize a fresh blockchain for this specific batch
        const medicineChain = new Blockchain();
        
        // Add genesis info (optional but good for tracking where it originated)
        medicineChain.chain[0].data = {
            event: 'Batch Created',
            medicineName,
            manufacturer,
        };
        // Re-calculate hash for the genesis block since we altered the payload data
        medicineChain.chain[0].hash = medicineChain.chain[0].calculateHash();

        const newBatch = await Batch.create({
            medicineName,
            manufacturer,
            chain: medicineChain.chain
        });

        res.status(201).json({ success: true, data: newBatch });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add a tracking update to an existing batch
// @route   POST /api/batches/:id/update
export const updateBatch = async (req, res) => {
    try {
        const { id } = req.params;
        const { updateData } = req.body; // e.g. { location: 'Warehouse A', handler: 'John Doe' }

        if (!updateData) {
            return res.status(400).json({ success: false, message: 'Missing updateData in request body' });
        }

        const batch = await Batch.findById(id);
        if (!batch) {
            return res.status(404).json({ success: false, message: 'Batch not found' });
        }

        // Reconstitute chain into our Blockchain service to get proper methods
        const medicineChain = new Blockchain(batch.chain);

        // Mine/Add the new block
        medicineChain.addBlock(updateData);

        // Update the database with the new array
        batch.chain = medicineChain.chain;
        await batch.save();

        res.status(200).json({ success: true, data: batch });
    } catch (error) {
        // Handle Invalid Mongo IDs cleanly
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ success: false, message: 'Batch not found' });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get full timeline history for a batch
// @route   GET /api/batches/:id
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
export const verifyBatch = async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id);
        if (!batch) {
            return res.status(404).json({ success: false, message: 'Batch not found' });
        }

        // Reconstitute chain and validate
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

// @desc    Simulate a hacker tampering with the Mongo data!
// @route   POST /api/batches/:id/tamper
export const tamperBatch = async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id);
        if (!batch) {
            return res.status(404).json({ success: false, message: 'Batch not found' });
        }

        // Maliciously alter the data of the genesis block without re-hashing
        if (batch.chain.length > 0) {
            batch.chain[0].data = { ...batch.chain[0].data, INTERCEPTED: "HACKER_TAMPERED" };
            // Mongoose needs this explicitly flagged when modifying deeply nested Mixed data directly via index
            batch.markModified('chain');
            
            // Save the silent hack directly to the database
            await batch.save();
        }

        res.status(200).json({ success: true, message: "Chain maliciously tampered!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
