import React, { useState } from 'react';
import { Filter, Tag } from 'lucide-react';

const SearchProblems = () => {
    const [category, setCategory] = useState('All');

    // Mock Data
    const problems = [
        { id: 1, title: 'Plastic Waste Reduction in Oceans', category: 'Environment', keywords: ['Sustainability', 'Ocean', 'Plastic'], postedBy: 'GreenEarth NGO' },
        { id: 2, title: 'AI-Driven Rural Education', category: 'Education', keywords: ['AI', 'EdTech', 'Rural'], postedBy: 'EduFoundation' },
        { id: 3, title: 'Smart Traffic Management', category: 'Smart Cities', keywords: ['IoT', 'Traffic', 'Urban'], postedBy: 'City Council' },
        { id: 4, title: 'Telemedicine for Remote Areas', category: 'Health', keywords: ['Healthcare', 'Remote', 'App'], postedBy: 'Global Health' },
    ];

    const topKeywords = ['#Sustainability', '#AI', '#Healthcare', '#FinTech', '#SmartCities', '#Blockchain', '#EdTech', '#CyberSecurity', '#AgriTech', '#MentalHealth'];

    return (

        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-slate-900">Find Problems to Solve</h1>
                    <p className="text-slate-500">Perfect for hackathons and innovators looking for challenges.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Sidebar Filters */}
                <div className="md:col-span-1">
                    <div className="glass-panel p-6 sticky top-24">
                        <h3 className="font-semibold mb-4 flex items-center gap-2"><Filter size={18} /> Filters</h3>

                        <div className="flex flex-col gap-2 mb-6">
                            <label className="font-semibold text-sm">Category</label>
                            <select className="input-field py-2" value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option>All Categories</option>
                                <option>Environment</option>
                                <option>Health</option>
                                <option>Education</option>
                                <option>Technology</option>
                            </select>
                        </div>

                        <h4 className="font-semibold text-sm mb-2">Top Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                            {topKeywords.map(kw => (
                                <span key={kw} className="bg-white hover:bg-slate-50 px-2 py-1 rounded text-xs text-slate-700 cursor-pointer transition-colors border border-slate-200">
                                    {kw}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="md:col-span-3 space-y-4">
                    <input type="text" className="input-field mb-4" placeholder="Search problems by keyword..." />

                    {problems.map(prob => (
                        <div key={prob.id} className="glass-panel p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-slate-900">{prob.title}</h3>
                                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold border border-indigo-100">{prob.category}</span>
                            </div>
                            <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                                Detailed description of the problem statement goes here. This area describes the constraints and requirements for the solution.
                            </p>
                            <div className="flex gap-2 flex-wrap mb-4">
                                {prob.keywords.map(k => (
                                    <span key={k} className="flex items-center gap-1 text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                        <Tag size={12} /> {k}
                                    </span>
                                ))}
                            </div>
                            <div className="flex justify-between items-center border-t border-slate-200 pt-4">
                                <span className="text-sm text-slate-500">Posted by <strong className="text-slate-900">{prob.postedBy}</strong></span>
                                <button className="btn-secondary text-sm py-1.5 px-3">Propose Solution</button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default SearchProblems;
