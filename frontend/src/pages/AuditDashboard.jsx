import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../lib/AuthContext';
import { Link } from 'react-router-dom';
import { 
    Search, 
    ShieldAlert, 
    History, 
    ArrowRight, 
    ExternalLink, 
    AlertTriangle, 
    Filter,
    Activity,
    Database,
    Check
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AuditDashboard = () => {
    const { user } = useAuth();
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recallLoading, setRecallLoading] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchAuditData();
    }, []);

    const fetchAuditData = async () => {
        try {
            const res = await api.get('/batches');
            if (res.data.success) {
                setBatches(res.data.data);
            }
        } catch (err) {
            console.error('Audit sync failed:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRecall = async (id, medicineName) => {
        const reason = prompt(`CRITICAL: Enter the official reason for recalling ${medicineName}:`);
        if (!reason) return;

        if (confirm(`You are about to issue a GLOBAL RECALL for ${medicineName}. This action is irreversible and will be logged on the ledger. Proceed?`)) {
            setRecallLoading(id);
            try {
                await api.post(`/batches/${id}/recall`, { reason });
                fetchAuditData(); // Refresh
            } catch (err) {
                alert(err.response?.data?.message || 'Recall failed');
            } finally {
                setRecallLoading(null);
            }
        }
    };

    const filteredBatches = batches.filter(b => 
        b.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        b._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.organization?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldAlert className="w-8 h-8 text-destructive animate-pulse" />
                        <h1 className="text-3xl font-extrabold tracking-tight">Compliance & <span className="text-primary">Audit Oracle</span></h1>
                    </div>
                    <p className="text-muted-foreground max-w-2xl">
                        Global oversight of the pharma supply chain. Monitor real-time ledger activity and issue safety recalls.
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-muted px-4 py-2 rounded-xl flex items-center gap-2 border border-border">
                        <Activity className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold uppercase tracking-wider">{batches.length} Managed Batches</span>
                    </div>
                </div>
            </header>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Audit by Medicine, Organization, or Batch ID..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 h-12 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
                    />
                </div>
                <Button variant="outline" className="h-12 border-border gap-2">
                    <Filter className="w-4 h-4" /> Advanced Audit
                </Button>
            </div>

            <Card className="border-border shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border">
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Medicine & Origin</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Ledger ID</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Compliance Status</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground text-right">Regulatory Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr><td colSpan="4" className="p-20 text-center animate-pulse text-primary font-bold">Syncing Global Ledger...</td></tr>
                            ) : filteredBatches.map(batch => (
                                <tr key={batch._id} className={`hover:bg-muted/30 transition-colors ${batch.status === 'RECALLED' ? 'bg-destructive/5' : ''}`}>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-lg">{batch.medicineName}</span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Database className="w-3 h-3" /> Produced by: {batch.organization?.name || 'Unknown'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 font-mono text-xs text-muted-foreground">
                                        {batch._id}
                                    </td>
                                    <td className="p-4">
                                        <span className={`status-badge ${
                                            batch.status === 'RECALLED' ? 'bg-destructive animate-bounce' :
                                            batch.status === 'SOLD' ? 'bg-success' : 'bg-info'
                                        }`}>
                                            {batch.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <Link to={`/batch/${batch._id}`}>
                                            <Button variant="ghost" size="sm" className="gap-1.5 h-9 font-bold">
                                                <History className="w-4 h-4" /> Full Audit
                                            </Button>
                                        </Link>
                                        {batch.status !== 'RECALLED' && batch.status !== 'SOLD' && (
                                            <Button 
                                                variant="destructive" 
                                                size="sm" 
                                                className="h-9 font-extrabold shadow-sm hover:shadow-destructive/20"
                                                onClick={() => handleRecall(batch._id, batch.medicineName)}
                                                disabled={recallLoading === batch._id}
                                            >
                                                <AlertTriangle className="w-4 h-4 mr-1.5" /> 
                                                {recallLoading === batch._id ? 'Processing...' : 'Recall'}
                                            </Button>
                                        )}
                                        {batch.status === 'RECALLED' && (
                                            <span className="inline-flex items-center text-xs font-bold text-destructive gap-1 px-3 py-1 bg-destructive/10 rounded-full border border-destructive/20">
                                                <ShieldAlert className="w-3.5 h-3.5" /> RECALLED
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <footer className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="p-6 bg-card border border-border rounded-2xl flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-xl"><Activity className="w-6 h-6 text-primary" /></div>
                    <div>
                        <h4 className="font-bold">Compliance Monitoring</h4>
                        <p className="text-sm text-muted-foreground mt-1">Real-time alerts for supply chain anomalies and delays.</p>
                    </div>
                </div>
                <div className="p-6 bg-card border border-border rounded-2xl flex items-start gap-4">
                    <div className="bg-destructive/10 p-3 rounded-xl"><ShieldAlert className="w-6 h-6 text-destructive" /></div>
                    <div>
                        <h4 className="font-bold text-destructive">Enforcement Mode</h4>
                        <p className="text-sm text-muted-foreground mt-1">Authorized recall orders take immediate effect on public verification.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AuditDashboard;
