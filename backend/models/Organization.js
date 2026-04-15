import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add an organization name'],
        unique: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['Manufacturer', 'Logistics', 'Warehouse', 'Pharmacy', 'Regulator', 'Other'],
        required: [true, 'Please add an organization type']
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    contactEmail: {
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const Organization = mongoose.model('Organization', organizationSchema);

export default Organization;
