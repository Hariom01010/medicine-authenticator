import mongoose from 'mongoose';

// The Block Schema represents the individual links in our chain.
// We disable _id because blocks are cryptographically linked by 'previousHash'.
const blockSchema = new mongoose.Schema({
    index: { type: Number, required: true },
    timestamp: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    previousHash: { type: String, required: true },
    hash: { type: String, required: true }
}, { _id: false });

const batchSchema = new mongoose.Schema({
    medicineName: { type: String, required: true },
    manufacturer: { type: String, required: true },
    // An independent ledger timeline for this exact medicine batch
    chain: [blockSchema]
}, { timestamps: true });

const Batch = mongoose.model('Batch', batchSchema);

export default Batch;
