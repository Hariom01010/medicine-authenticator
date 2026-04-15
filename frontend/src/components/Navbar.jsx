import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { Button } from "@/components/ui/button";

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate('/login');
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const NavLinks = () => (
        <>
            {!user ? (
                <>
                    <a href="#verify" onClick={closeMenu} className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">Verify</a>
                    <Link to="/login" onClick={closeMenu} className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">Sign In</Link>
                    <Link to="/register" onClick={closeMenu}>
                        <Button size="sm" className="font-bold px-5 w-full md:w-auto">Join Network</Button>
                    </Link>
                </>
            ) : (
                <>
                    <Link to="/dashboard" onClick={closeMenu} className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">Dashboard</Link>
                    {user?.role === 'Manufacturer' && (
                        <Link to="/create" onClick={closeMenu} className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">Mint Batch</Link>
                    )}
                    {user?.role === 'Admin' && (
                        <Link to="/admin/orgs" onClick={closeMenu} className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">Manage Partners</Link>
                    )}
                    {(user?.role === 'Regulator' || user?.role === 'Admin') && (
                        <Link to="/audit" onClick={closeMenu} className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">Compliance Audit</Link>
                    )}
                    <Link to="/update" onClick={closeMenu} className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">Log Activity</Link>
                    <Link to="/profile" onClick={closeMenu} className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">Profile</Link>
                    <Button 
                        variant="ghost" 
                        onClick={handleLogout}
                        className="text-sm font-bold text-destructive hover:bg-destructive/10 transition-all border border-destructive/20 w-full md:w-auto mt-2 md:mt-0 md:ml-2"
                    >
                        Sign Out
                    </Button>
                </>
            )}
        </>
    );

    return (
        <header className="border-b border-border bg-card/80 backdrop-blur-md p-4 sticky top-0 z-50 shadow-sm transition-all">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link to={user ? "/dashboard" : "/"} onClick={closeMenu} className="flex items-center gap-2 text-2xl font-bold text-primary transition-all hover:opacity-80">
                    <ShieldCheck className="h-8 w-8 text-primary shadow-sm rounded-lg" />
                    <span className="tracking-tight">MediChain</span>
                </Link>
                
                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    <NavLinks />
                </nav>

                {/* Mobile Toggle */}
                <button 
                    onClick={toggleMenu}
                    className="md:hidden p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-all"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMenuOpen && (
                <div 
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
                    onClick={closeMenu}
                />
            )}

            {/* Mobile Sidebar */}
            <div className={`fixed top-0 right-0 h-screen w-[280px] bg-white border-l border-border z-50 shadow-2xl transition-all duration-300 flex flex-col md:hidden ${isMenuOpen ? 'translate-x-0 opacity-100 visible' : 'translate-x-full opacity-0 invisible'}`}>
                <div className="p-6 border-b border-border flex items-center justify-between bg-primary/5">
                    <span className="font-extrabold text-primary tracking-tight">Navigation</span>
                    <button onClick={closeMenu} className="p-2 hover:bg-muted rounded-lg transition-colors"><X size={20} /></button>
                </div>
                <nav className="p-8 flex flex-col gap-8 flex-1 overflow-y-auto bg-white">
                    <NavLinks />
                </nav>
                <div className="p-6 border-t border-border bg-muted/30 text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
                    MediChain Governance v1.0
                </div>
            </div>
        </header>
    );
};

export default Navbar;
