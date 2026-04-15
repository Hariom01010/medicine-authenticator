import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import api from '../lib/api';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Manufacturer',
        organizationId: '',
        adminSecret: ''
    });
    const [organizations, setOrganizations] = useState([]);
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrgs = async () => {
            try {
                const res = await api.get('/organizations');
                if (res.data.success) {
                    setOrganizations(res.data.data);
                    // Set first org as default if available
                    if (res.data.data.length > 0) {
                        setFormData(prev => ({ ...prev, organizationId: res.data.data[0]._id }));
                    }
                }
            } catch (err) {
                console.error('Error fetching organizations:', err);
            }
        };
        fetchOrgs();
    }, []);

    // Auto-update role based on Org selection
    useEffect(() => {
        if (formData.role === 'Admin') return; // Don't auto-update if they intended to be Admin

        const selectedOrg = organizations.find(o => o._id === formData.organizationId);
        if (selectedOrg) {
            const mapping = {
                'Manufacturer': 'Manufacturer',
                'Logistics': 'Transporter',
                'Warehouse': 'Warehouse',
                'Pharmacy': 'Pharmacist',
                'Regulator': 'Regulator'
            };
            setFormData(prev => ({ ...prev, role: mapping[selectedOrg.type] || prev.role }));
        }
    }, [formData.organizationId, organizations]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Skip organization validation for Admins
        if (formData.role !== 'Admin' && !formData.organizationId) {
            setError('Please select an organization');
            return;
        }

        try {
            const res = await register(formData);
            if (res.success) {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Create Account</h2>
                <p className="auth-subtitle">Join the secure pharma supply chain</p>
                
                {error && <div className="error-alert">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input 
                            name="name"
                            type="text" 
                            placeholder="John Doe" 
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input 
                            name="email"
                            type="email" 
                            placeholder="name@company.com" 
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Organization</label>
                        <select 
                            name="organizationId" 
                            value={formData.organizationId} 
                            onChange={handleChange} 
                            className="auth-select"
                            disabled={formData.role === 'Admin'}
                            required={formData.role !== 'Admin'}
                        >
                            <option value="">{formData.role === 'Admin' ? 'Not Required for Admins' : 'Select Organization'}</option>
                            {organizations.map(org => (
                                <option key={org._id} value={org._id}>{org.name} ({org.type})</option>
                            ))}
                        </select>
                        <small className="form-help">
                            {formData.role === 'Admin' ? 'System Administrators work globally.' : 'Ask your admin for the correct organization name.'}
                        </small>
                    </div>
                    <div className="form-group">
                        <label>Industry Role</label>
                        <select name="role" value={formData.role} onChange={handleChange} className="auth-select">
                            {/* If Admin is selected, show Admin role */}
                            {formData.role === 'Admin' ? (
                                <option value="Admin">System Administrator</option>
                            ) : (
                                <>
                                    {/* Dynamically show roles based on Organization Type */}
                                    {(() => {
                                        const selectedOrg = organizations.find(o => o._id === formData.organizationId);
                                        const type = selectedOrg?.type;

                                        if (type === 'Manufacturer') return <option value="Manufacturer">Manufacturer</option>;
                                        if (type === 'Logistics') return <option value="Transporter">Logistics Transporter</option>;
                                        if (type === 'Warehouse') return <option value="Warehouse">Warehouse Manager</option>;
                                        if (type === 'Pharmacy') return <option value="Pharmacist">Authorized Pharmacist</option>;
                                        if (type === 'Regulator') return <option value="Regulator">Compliance Regulator</option>;
                                        
                                        return <option value="">Select Organization First</option>;
                                    })()}
                                </>
                            )}
                        </select>
                        <small className="form-help">This determines your permissions in the supply chain.</small>
                    </div>

                    {formData.role === 'Admin' && (
                        <div className="form-group animate-in slide-in-from-top-2 duration-300">
                            <label className="text-primary font-bold">Admin registration Secret</label>
                            <input 
                                name="adminSecret"
                                type="password" 
                                placeholder="Enter System Passcode" 
                                value={formData.adminSecret}
                                onChange={handleChange}
                                required
                                className="border-primary/50 focus:border-primary border-2"
                            />
                            <small className="text-primary/70 font-medium">This secret is required to authorize global system access.</small>
                        </div>
                    )}
                    
                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            name="password"
                            type="password" 
                            placeholder="••••••••" 
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button">Create Account</button>
                </form>
                
                <div className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
