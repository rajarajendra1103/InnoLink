import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function Welcome() {
    return (
        <div className="min-h-[90vh] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -z-10"></div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-sm text-indigo-700 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Sparkles size={14} /> <span>The platform for future unicorns</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 text-slate-900">
                Where <span className="gradient-text">Ideas</span> meet <br />
                <span className="text-slate-900">Validation & Capital.</span>
            </h1>

            <p className="text-xl text-slate-600 max-w-2xl mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                InnoLink bridges the gap between problem solvers and visionaries.
                Post your problems, pitch your ideas, and get funded.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
                <Link to="/signup" className="btn-primary text-lg px-8 py-4">
                    Start Your Journey
                </Link>
                <Link to="/login" className="px-8 py-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors font-semibold">
                    Sign In
                </Link>
            </div>

            {/* Stats or Trust signals could go here */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-12 text-center opacity-60">
                <div><div className="text-2xl font-bold">500+</div><div className="text-sm">Startups Funded</div></div>
                <div><div className="text-2xl font-bold">$12M</div><div className="text-sm">Capital Deployed</div></div>
                <div><div className="text-2xl font-bold">10k+</div><div className="text-sm">Innovators</div></div>
                <div><div className="text-2xl font-bold">98%</div><div className="text-sm">Success Rate</div></div>
            </div>
        </div>
    );
}
