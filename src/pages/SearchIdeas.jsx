import React, { useState } from 'react';
import { Search, Loader, Zap, Users, Lightbulb, CheckCircle, AlertTriangle, ArrowRight, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyzeIdeaWithGemini } from '../services/geminiService';

const SearchIdeas = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [analysis, setAnalysis] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (query.trim().length < 10) return;

        setSearching(true);
        setAnalysis(null);
        setResults([]);

        // Call Gemini Service
        const result = await analyzeIdeaWithGemini(query);

        setAnalysis({
            summary: result.summary,
            isNew: !result.isDuplicate && result.score < 50,
            score: result.score,
            message: result.recommendation === 'Publish' ? 'Original Concept Verified' : 'Similar Concept Detected',
            color: result.color,
            bg: result.bg,
            recommendation: result.recommendation
        });

        if (result.matchedItem) {
            // Ensure matchedItem has necessary fields for display or fill defaults
            setResults([{
                id: result.matchedItem.id || 'ex-1',
                title: result.matchedItem.title || 'Existing Project',
                summary: 'Start browsing to see full details...',
                author: result.matchedItem.author || 'Unknown',
                similarity: `${result.score}%`
            }]);
        }

        setSearching(false);
    };

    const getStatusColors = (recommendation) => {
        switch (recommendation) {
            case 'Publish': return { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-700', iconInfo: 'text-green-600' };
            case 'Improve': return { border: 'border-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', iconInfo: 'text-amber-600' };
            case 'Collaborate': return { border: 'border-red-500', bg: 'bg-red-50', text: 'text-red-700', iconInfo: 'text-red-600' };
            default: return { border: 'border-slate-300', bg: 'bg-slate-50', text: 'text-slate-600', iconInfo: 'text-slate-500' };
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold mb-3 text-blue-600">Discover & Validate Ideas <span className="text-indigo-500 text-lg block sm:inline">(Powered by Gemini)</span></h1>
                <p className="text-slate-600 max-w-xl mx-auto">
                    Enter your concept. Our AI will summarize it and cross-reference our database for duplicates.
                </p>
            </div>

            {/* SEARCH INPUT */}
            <div className="glass-panel p-6 mb-8">
                <form onSubmit={handleSearch}>
                    <label className="font-semibold mb-2 block text-slate-700">Describe your idea in detail</label>
                    <textarea
                        className="input-field min-h-[120px]"
                        placeholder="e.g., A drone system that uses biodegradable nets to catch plastic waste in small rivers..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    ></textarea>

                    <div className="flex justify-between items-center mt-4">
                        <span className="text-xs text-slate-500">Min 10 characters for analysis</span>
                        <button
                            type="submit"
                            className="btn-primary px-8 py-2.5 flex items-center gap-2"
                            disabled={searching || query.length < 10}
                        >
                            {searching ? (
                                <> <Loader className="animate-spin" size={18} /> Analyzing... </>
                            ) : (
                                <> <Search size={18} /> Check Availability </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* ANALYSIS RESULTS */}
            {analysis && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* SUMMARY CARD */}
                    <div className={`glass-panel p-6 mb-6 border-l-4 ${getStatusColors(analysis.recommendation).border}`}>
                        <h4 className={`font-bold mb-3 flex items-center gap-2 ${getStatusColors(analysis.recommendation).text}`}>
                            <Zap size={20} /> AI Summary
                        </h4>
                        <p className="text-slate-700 italic text-lg leading-relaxed">
                            "{analysis.summary}"
                        </p>
                    </div>

                    {/* STATUS CARD */}
                    {analysis.recommendation === 'Publish' ? (
                        // --- NEW IDEA FLOW ---
                        <div className="glass-panel text-center py-10 px-6">
                            <div className="inline-flex p-4 bg-green-100 rounded-full text-green-600 mb-6 border border-green-200">
                                <CheckCircle size={48} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Original Concept Verified</h2>
                            <p className="text-slate-600 mb-8 max-w-md mx-auto">
                                Great! We found minimal overlap (Score: <span className="text-green-600 font-bold">{analysis.score}%</span>) with existing projects.
                            </p>
                            <Link to="/register-idea" className="btn-primary py-3 px-8 text-lg inline-flex items-center gap-2">
                                Register Idea <ArrowRight size={20} />
                            </Link>
                        </div>
                    ) : (
                        // --- DUPLICATE / SIMILAR FLOW ---
                        <div className={`glass-panel p-0 overflow-hidden border ${getStatusColors(analysis.recommendation).border}`}>
                            <div className={`p-6 border-b ${getStatusColors(analysis.recommendation).border} ${getStatusColors(analysis.recommendation).bg} flex items-start gap-4`}>
                                <div className={`p-3 rounded-full bg-white ${getStatusColors(analysis.recommendation).text}`}>
                                    <AlertTriangle size={32} />
                                </div>
                                <div>
                                    <h2 className={`text-xl font-bold ${getStatusColors(analysis.recommendation).text} mb-1`}>{analysis.message}</h2>
                                    <p className="text-slate-600 text-sm">
                                        Similarity Score: <strong className="text-slate-900">{analysis.score}%</strong>. Recommendation: <strong className="text-slate-900">{analysis.recommendation}</strong>.
                                    </p>
                                </div>
                            </div>

                            {results.length > 0 && (
                                <div className="p-6">
                                    <h4 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Closest Existing Match</h4>
                                    <div className="space-y-4">
                                        {results.map(item => (
                                            <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                <div>
                                                    <h4 className="text-lg font-semibold mb-1 text-slate-800">{item.title}</h4>
                                                    <p className="text-sm text-slate-600 mb-2">{item.summary}</p>
                                                    <div className="text-xs text-slate-500">By <strong className="text-slate-700">{item.author}</strong> • <span className={`${getStatusColors(analysis.recommendation).text} font-bold`}>{item.similarity} Match</span></div>
                                                </div>
                                                <button className="btn-secondary text-sm whitespace-nowrap">Connect</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchIdeas;
