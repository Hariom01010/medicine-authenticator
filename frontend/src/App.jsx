import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/AuthContext';
import Navbar from './components/Navbar';

// Import Pages
import Home from './pages/Home';
import CreateBatch from './pages/CreateBatch';
import UpdateBatch from './pages/UpdateBatch';
import BatchDetails from './pages/BatchDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import AdminOrgs from './pages/AdminOrgs';
import AuditDashboard from './pages/AuditDashboard';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading Security Protocols...</div>;
    
    if (!user) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role) && user.role !== 'Admin') {
        return <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-red-500">Access Denied</h2>
            <p>Your current role ({user.role}) does not have permission to access this operation.</p>
        </div>;
    }

    return children;
};

// Redirect logged in users away from public landing pages
const AuthRedirect = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (user) return <Navigate to="/dashboard" />;
    return children;
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="min-h-screen bg-background text-foreground flex flex-col">
                    <Navbar />
                    <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={
                                <AuthRedirect>
                                    <Landing />
                                </AuthRedirect>
                            } />
                            <Route path="/batch/:id" element={<BatchDetails />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* Role-Protected Routes */}
                            <Route 
                                path="/dashboard" 
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/admin/orgs" 
                                element={
                                    <ProtectedRoute allowedRoles={['Admin']}>
                                        <AdminOrgs />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/audit" 
                                element={
                                    <ProtectedRoute allowedRoles={['Regulator', 'Admin']}>
                                        <AuditDashboard />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/create" 
                                element={
                                    <ProtectedRoute allowedRoles={['Manufacturer']}>
                                        <CreateBatch />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/update" 
                                element={
                                    <ProtectedRoute allowedRoles={['Transporter', 'Warehouse', 'Pharmacist']}>
                                        <UpdateBatch />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/profile" 
                                element={
                                    <ProtectedRoute>
                                        <Profile />
                                    </ProtectedRoute>
                                } 
                            />
                        </Routes>
                    </main>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
