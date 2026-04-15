import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../lib/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Building2, Mail, MapPin, ListFilter } from 'lucide-react';

const AdminOrgs = () => {
    const { user } = useAuth();
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        type: 'Manufacturer',
        address: '',
        contactEmail: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchOrgs();
    }, []);

    const fetchOrgs = async () => {
        try {
            const res = await api.get('/organizations');
            if (res.data.success) {
                setOrganizations(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching organizations:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        try {
            const res = await api.post('/organizations', formData);
            if (res.data.success) {
                setMessage({ type: 'success', text: 'Organization registered on ledger successfully!' });
                setFormData({ name: '', type: 'Manufacturer', address: '', contactEmail: '' });
                fetchOrgs();
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create organization' });
        }
    };

    const handleDeleteOrg = async (id) => {
        if (!window.confirm('Are you sure? This will remove the organization and all linked staff access.')) return;
        try {
            const res = await api.delete(`/organizations/${id}`);
            if (res.data.success) {
                fetchOrgs();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete organization');
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Organization <span className="text-primary">Registry</span></h1>
                    <p className="text-muted-foreground mt-1">Manage approved industry partners in the MediChain ecosystem.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Registration Form */}
                <div className="lg:col-span-1">
                    <Card className="border-border shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Plus className="w-5 h-5 text-primary" /> New Partner
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {message.text && (
                                    <div className={`p-3 rounded-lg text-sm font-medium border ${
                                        message.type === 'success' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'
                                    }`}>
                                        {message.text}
                                    </div>
                                )}
                                <div>
                                    <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Entity Name</label>
                                    <Input required name="name" value={formData.name} onChange={handleChange} placeholder="Global Pharma Inc." />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Industry Type</label>
                                    <select 
                                        name="type" 
                                        value={formData.type} 
                                        onChange={handleChange}
                                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="Manufacturer">Manufacturer (Genesis)</option>
                                        <option value="Logistics">Logistics (Transport)</option>
                                        <option value="Warehouse">Warehouse (Storage)</option>
                                        <option value="Pharmacy">Pharmacy (Retail)</option>
                                        <option value="Regulator">Regulator (Compliance)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Headquarters Address</label>
                                    <Input required name="address" value={formData.address} onChange={handleChange} placeholder="123 Pharma Plaza, NY" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Contact Email</label>
                                    <Input name="contactEmail" value={formData.contactEmail} onChange={handleChange} placeholder="admin@pharma.com" />
                                </div>
                                <Button type="submit" className="w-full font-bold shadow-md">Register Entity</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Registry Table */}
                <div className="lg:col-span-2">
                    <Card className="border-border shadow-lg overflow-hidden">
                        <div className="p-4 bg-muted/30 border-b border-border flex justify-between items-center text-sm font-bold">
                            <span className="flex items-center gap-2"><ListFilter className="w-4 h-4" /> Active Registry</span>
                            <span className="text-muted-foreground">{organizations.length} Partners</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-muted/10 border-b border-border">
                                        <th className="p-4 text-xs font-bold uppercase text-muted-foreground">Organization</th>
                                        <th className="p-4 text-xs font-bold uppercase text-muted-foreground">Type</th>
                                        <th className="p-4 text-xs font-bold uppercase text-muted-foreground">Address</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {loading ? (
                                        <tr><td colSpan="3" className="p-10 text-center animate-pulse text-primary font-bold">Syncing Registry...</td></tr>
                                    ) : organizations.map(org => (
                                        <tr key={org._id} className="hover:bg-muted/20 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-primary/10 p-2 rounded-lg"><Building2 className="w-5 h-5 text-primary" /></div>
                                                    <div>
                                                        <p className="font-bold">{org.name}</p>
                                                        <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" /> {org.contactEmail || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-[10px] font-bold px-2 py-1 bg-secondary rounded-full border border-border">
                                                    {org.type}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {org.address}</p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminOrgs;
