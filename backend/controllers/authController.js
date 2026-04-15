import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// @desc    Register user
// @route   POST /api/auth/register
export const register = async (req, res) => {
    try {
        const { name, email, password, role, organizationId, adminSecret } = req.body;

        // Security check for Admin role
        if (role === 'Admin') {
            const systemSecret = process.env.ADMIN_REGISTRATION_SECRET || 'medichain_admin_2026'; // Fallback for dev
            if (adminSecret !== systemSecret) {
                return res.status(401).json({ success: false, message: 'Invalid Admin Registration Secret' });
            }
        } else {
            // Role Enforcement: Validate role vs Organization Type
            const Organization = (await import('../models/Organization.js')).default;
            const org = await Organization.findById(organizationId);
            if (!org) return res.status(404).json({ success: false, message: 'Organization not found' });

            const mapping = {
                'Manufacturer': ['Manufacturer'],
                'Logistics': ['Transporter'],
                'Warehouse': ['Warehouse'],
                'Pharmacy': ['Pharmacist'],
                'Regulator': ['Regulator']
            };

            if (!mapping[org.type] || !mapping[org.type].includes(role)) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Business Logic Violation: A ${org.type} organization does not support the ${role} role.` 
                });
            }
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            organization: organizationId || undefined,
            adminSecret // This won't be saved to DB but is used for validation
        });

        if (user) {
            const populatedUser = await User.findById(user._id).populate('organization', 'name');
            res.status(201).json({
                success: true,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                organization: populatedUser.organization,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password').populate('organization', 'name');

        if (user && (await user.matchPassword(password))) {
            res.json({
                success: true,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                organization: user.organization,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete user profile (Keeps medicine batches intact)
// @route   DELETE /api/auth/me
export const deleteMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            await User.deleteOne({ _id: req.user._id });
            res.json({ success: true, message: 'User profile deleted successfully. Medicine batches remain for tracking.' });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d'
    });
};
