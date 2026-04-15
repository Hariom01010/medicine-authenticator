import Organization from '../models/Organization.js';

// @desc    Create new organization
// @route   POST /api/organizations
// @access  Private (Admin only)
export const createOrganization = async (req, res) => {
    try {
        const { name, type, address, contactEmail } = req.body;

        const orgExists = await Organization.findOne({ name });

        if (orgExists) {
            return res.status(400).json({ success: false, message: 'Organization already exists' });
        }

        const organization = await Organization.create({
            name,
            type,
            address,
            contactEmail,
            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            data: organization
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all organizations
// @route   GET /api/organizations
// @access  Public (For registration selection)
export const getOrganizations = async (req, res) => {
    try {
        const organizations = await Organization.find().select('name type');
        res.status(200).json({
            success: true,
            count: organizations.length,
            data: organizations
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
