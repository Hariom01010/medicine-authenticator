import React, { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { User, Mail, Shield, AlertTriangle } from 'lucide-react';

const Profile = () => {
    const { user, deleteAccount } = useAuth();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [message, setMessage] = useState('');

    const handleDelete = async () => {
        try {
            const res = await deleteAccount();
            if (res.success) {
                // AuthContext will handle logout and redirect
            }
        } catch (err) {
            setMessage('Error deleting account');
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="bg-card p-8 rounded-xl border border-border shadow-sm">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <User className="h-6 w-6 text-primary" />
                    Account Profile
                </h2>

                <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Full Name</p>
                            <p className="font-semibold">{user?.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Email Address</p>
                            <p className="font-semibold">{user?.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Industry Role</p>
                            <p className="font-semibold">{user?.role}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-red-500/5 p-8 rounded-xl border border-red-500/20">
                <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Danger Zone
                </h3>
                <p className="text-muted-foreground mb-6">
                    Deleting your account will remove your login access. 
                    <span className="font-bold text-foreground"> Note: Your created medicine batches and tracking history will remain in the supply chain for regulatory compliance and public tracking.</span>
                </p>

                {!confirmDelete ? (
                    <button 
                        onClick={() => setConfirmDelete(true)}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                        Delete My Profile
                    </button>
                ) : (
                    <div className="space-y-4">
                        <p className="font-bold text-red-600">Are you absolutely sure? This action is irreversible.</p>
                        <div className="flex gap-4">
                            <button 
                                onClick={handleDelete}
                                className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                            >
                                Yes, Delete Profile
                            </button>
                            <button 
                                onClick={() => setConfirmDelete(false)}
                                className="bg-muted px-6 py-2 rounded-lg font-medium hover:bg-muted-foreground/10 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
                {message && <p className="mt-4 text-sm text-red-500">{message}</p>}
            </div>
        </div>
    );
};

export default Profile;
