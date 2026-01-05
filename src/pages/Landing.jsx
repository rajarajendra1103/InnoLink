import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, Building, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Landing() {
    const { userProfile } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -z-10"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] -z-10"></div>

            <div className="max-w-4xl w-full text-center space-y-12 z-10">

                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold">
                        Welcome, <span className="gradient-text">{userProfile?.fullName || 'Innovator'}</span>
                    </h1>
                    <p className="text-xl text-slate-500">What is your focus today?</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 w-full">
                    {/* Innovator Card */}
                    <div
                        onClick={() => navigate('/ideas')} // Or wherever Innovator flow goes
                        className="group relative cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                        <div className="relative glass-panel p-8 h-full flex flex-col items-center justify-center gap-6 border border-indigo-100 group-hover:border-indigo-400 transition-all hover:-translate-y-2 bg-white/80">
                            <div className="h-20 w-20 rounded-2xl bg-indigo-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <Lightbulb className="h-10 w-10 text-indigo-600" />
                            </div>
                            <div className="text-center space-y-2">
                                <h2 className="text-2xl font-bold text-slate-900">Innovator</h2>
                                <p className="text-slate-500 text-sm">Post problems, share ideas, and build solutions.</p>
                            </div>
                            <div className="flex items-center text-indigo-600 font-semibold gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                Enter Workspace <ArrowRight size={16} />
                            </div>
                        </div>
                    </div>

                    {/* Investor Card */}
                    <div
                        onClick={() => navigate('/problems')} // Or wherever Investor flow goes
                        className="group relative cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                        <div className="relative glass-panel p-8 h-full flex flex-col items-center justify-center gap-6 border border-purple-100 group-hover:border-purple-400 transition-all hover:-translate-y-2 bg-white/80">
                            <div className="h-20 w-20 rounded-2xl bg-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <Building className="h-10 w-10 text-purple-600" />
                            </div>
                            <div className="text-center space-y-2">
                                <h2 className="text-2xl font-bold text-slate-900">Innovestor</h2>
                                <p className="text-slate-500 text-sm">Discover startups, fund ideas, and support growth.</p>
                            </div>
                            <div className="flex items-center text-purple-600 font-semibold gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                Start Investing <ArrowRight size={16} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
