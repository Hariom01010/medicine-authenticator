import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Zap, Lock, Globe, Search } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Landing = () => {
    const [batchId, setBatchId] = useState("");
    const navigate = useNavigate();

    const handleVerify = (e) => {
        e.preventDefault();
        if (batchId.trim()) navigate(`/batch/${batchId.trim()}`);
    };

    return (
        <div className="flex flex-col gap-24 pb-20 animate-in fade-in duration-1000">
            {/* Hero Section */}
            <section className="relative pt-10 text-center space-y-8 max-w-4xl mx-auto">
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -z-10"></div>
                
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                    <Zap className="w-3.5 h-3.5" /> Next-Gen Pharma Ledger
                </div>
                
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                    Restoring Trust in <span className="text-primary italic">Global Medicine</span>
                </h1>
                
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    A cryptographically secured supply chain that eliminates counterfeit pharmaceuticals. Verify every dose, from factory to pharmacy.
                </p>
                
                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                    <Link to="/register">
                        <Button size="lg" className="h-14 px-8 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                            Join the Network <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                    <a href="#verify">
                        <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-bold border border-border bg-card">
                            Verify a Batch
                        </Button>
                    </a>
                </div>
            </section>

            {/* Quick Verify Section */}
            <section id="verify" className="max-w-2xl mx-auto w-full px-4">
                <Card className="border-border shadow-2xl bg-card/50 backdrop-blur-sm p-2">
                    <CardContent className="pt-6">
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold flex items-center justify-center gap-2">
                                <Search className="w-5 h-5 text-primary" /> Instant Verification
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">Found a batch ID? Verify its cryptographic timeline below.</p>
                        </div>
                        <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-2">
                            <Input 
                                placeholder="Enter Unique Batch Identifier" 
                                value={batchId}
                                onChange={(e) => setBatchId(e.target.value)}
                                className="h-14 text-center text-lg bg-background border-border shadow-inner focus:ring-primary/20"
                            />
                            <Button type="submit" size="lg" className="h-14 px-8 font-bold w-full sm:w-auto">Validate</Button>
                        </form>
                    </CardContent>
                </Card>
            </section>

            {/* Features Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="group p-8 bg-card border border-border rounded-3xl hover:border-primary/30 transition-all hover:shadow-xl hover:-translate-y-1">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Lock className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Immutable Ledger</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Every handoff is cryptographically sealed. Once a block is mined, it can never be altered or deleted.
                    </p>
                </div>

                <div className="group p-8 bg-card border border-border rounded-3xl hover:border-primary/30 transition-all hover:shadow-xl hover:-translate-y-1">
                    <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Role-Based Integrity</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Industry-specific protocols ensure that only verified Manufacturers and Logistics partners can log activity.
                    </p>
                </div>

                <div className="group p-8 bg-card border border-border rounded-3xl hover:border-primary/30 transition-all hover:shadow-xl hover:-translate-y-1">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Globe className="w-6 h-6 text-amber-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Global Tracking</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Transporters, Warehouses, and Pharmacists coordinate in real-time to maintain a 100% transparent history.
                    </p>
                </div>
            </section>

            {/* Footer / Final CTA */}
            <section className="text-center bg-primary/5 py-16 rounded-[3rem] border border-primary/10">
                <h2 className="text-3xl font-bold mb-4">Ready to secure the supply chain?</h2>
                <p className="text-muted-foreground mb-8">Join thousands of verified medicine partners across the world.</p>
                <div className="flex justify-center gap-4">
                    <Link to="/login"><Button variant="ghost" className="font-bold">Sign In</Button></Link>
                    <Link to="/register"><Button className="font-bold px-8">Register Now</Button></Link>
                </div>
            </section>
        </div>
    );
};

export default Landing;
