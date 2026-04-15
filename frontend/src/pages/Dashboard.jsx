import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../lib/AuthContext';
import { Box, Copy, Check, Eye, Clock, Database } from 'lucide-react';

const Dashboard = () => {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchBatches();
    }, []);

    const fetchBatches = async () => {
        try {
            const res = await api.get('/batches');
            if (res.data.success) {
                setBatches(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching batches:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (id) => {
        navigator.clipboard.writeText(id);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (loading) return <div className="text-center mt-20 text-primary animate-pulse font-bold">Synchronizing with Distributed Nodes...</div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 px-4 md:px-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Supply Chain <span className="text-primary">Ledger</span></h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {user.role === 'Manufacturer' 
                            ? "Overview of all batches minted by your facility." 
                            : "Active medicine batches currently tracking through the network."}
                    </p>
                </div>
                <div className="bg-primary/10 px-4 py-2 rounded-lg border border-primary/20 flex items-center gap-3 w-full md:w-auto">
                    <Database className="h-5 w-5 text-primary" />
                    <div>
                        <p className="text-[10px] uppercase font-bold text-primary/70 tracking-widest">Global State</p>
                        <p className="text-sm font-bold">{batches.length} Active Batches</p>
                    </div>
                </div>
            </div>

            {batches.length === 0 ? (
                <div className="text-center p-10 md:p-20 bg-card rounded-2xl border border-dashed border-border">
                    <Box className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <h3 className="text-xl font-bold mb-2">No Records Found</h3>
                    <p className="text-muted-foreground text-sm mb-6">Your facility hasn't recorded any medicine batches on the blockchain yet.</p>
                    {user.role === 'Manufacturer' && (
                        <button 
                            onClick={() => navigate('/create')}
                            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold hover:shadow-lg transition-all"
                        >
                            Mint First Batch
                        </button>
                    )}
                </div>
            ) : (
                <div className="overflow-x-auto bg-card rounded-2xl border border-border shadow-xl">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border">
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Medicine</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Batch Identifier</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Organization</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Current Status</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {batches.map((batch) => (
                                <tr key={batch._id} className="hover:bg-muted/30 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-primary/10 p-2 rounded-lg">
                                                <Box className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground">{batch.medicineName}</p>
                                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    Updated {new Date(batch.updatedAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 group/id">
                                            <code className="text-[11px] bg-background px-2 py-1 rounded border border-border font-mono text-primary/80">
                                                {batch._id}
                                            </code>
                                            <button 
                                                onClick={() => handleCopy(batch._id)}
                                                className="opacity-0 group-hover/id:opacity-100 p-1.5 hover:bg-primary/10 rounded transition-all"
                                                title="Copy Batch ID"
                                            >
                                                {copiedId === batch._id ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{batch.organization?.name || 'Local'}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`status-badge ${
                                            batch.status === 'CREATED' ? 'bg-info' :
                                            batch.status === 'IN_TRANSIT' ? 'bg-warning' :
                                            batch.status === 'WAREHOUSE' ? 'bg-secondary' :
                                            batch.status === 'PHARMACY' ? 'bg-success' :
                                            'bg-muted'
                                        }`}>
                                            {batch.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {user.role !== 'Manufacturer' && (
                                                <button 
                                                    onClick={() => navigate(`/update?id=${batch._id}`)}
                                                    className="inline-flex items-center gap-2 text-xs font-bold bg-success text-white px-3 py-1.5 rounded-lg hover:shadow-md transition-all border-none"
                                                >
                                                    Sign Update
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => navigate(`/batch/${batch._id}`)}
                                                className="inline-flex items-center gap-2 text-xs font-bold bg-secondary text-secondary-foreground px-3 py-1.5 rounded-lg hover:bg-muted transition-all"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                View
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
