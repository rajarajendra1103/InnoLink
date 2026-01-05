import React, { useState } from 'react';
import {
    Lock, Search, CheckCircle, AlertCircle,
    Shield, ArrowRight, Lightbulb, Users, FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createIdeaRegistration } from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';

const RegisterIdea = () => {
    const { currentUser, userProfile } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Check, 2: Details, 3: Success
    const [title, setTitle] = useState('');
    const [concept, setConcept] = useState('');

    const [checking, setChecking] = useState(false);
    const [analysis, setAnalysis] = useState(null);

    // Registration Data
    const [lockDuration, setLockDuration] = useState('7'); // days

    const checkAvailability = async () => {
        if (title.length < 3 || concept.length < 10) return;
        setChecking(true);
        setAnalysis(null);

        // Call Gemini Service
        const result = await analyzeIdeaWithGemini(`${title}: ${concept}`);

        // Adapt Service Result to Component State
        const adaptedAnalysis = {
            score: result.score,
            summary: result.summary,
            recommendation: result.recommendation === 'Improve uniqueness' ? 'Improve' : result.recommendation, // Map 'Improve uniqueness' to 'Improve' for internal logic if needed, or update UI matching
            similar: result.matchedItem ? [{
                id: result.matchedItem.id || 'ex-1',
                title: result.matchedItem.title || 'Existing Project',
                author: result.matchedItem.author || 'Unknown',
                match: `${result.score}%`
            }] : []
        };

        setAnalysis(adaptedAnalysis);
        setChecking(false);
    };

    const handleRegister = async () => {
        if (!currentUser) return alert("Please login to register ideas");
        try {
            await createIdeaRegistration({
                title,
                concept,
                lockDuration,
                authorId: currentUser.uid,
                authorName: userProfile?.fullName || currentUser.email,
                similarityScore: analysis?.score || 0
            });
            setStep(3);
            setTimeout(() => {
                navigate('/profile');
            }, 2500);
        } catch (error) {
            console.error("Failed to register idea:", error);
            alert("Failed to register idea. Please try again.");
        }
    };

    return (

        <div className="container mx-auto px-4 py-8 max-w-2xl">

            <div className="glass-panel p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4 border border-green-100 shadow-[0_0_15px_rgba(74,222,128,0.1)]">
                        <Shield size={32} className="text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2 text-slate-900">Secure Idea Registration</h1>
                    <p className="text-slate-500">
                        Deep Semantic Check & Timestamp Locking (Powered by Gemini)
                    </p>
                </div>

                {/* --- STEP 1: CONTEXT & CHECK --- */}
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">

                        <div>
                            <label className="font-semibold block mb-2 text-slate-700">Idea Title</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="e.g., Solar Powered Water Filter"
                                value={title}
                                onChange={(e) => { setTitle(e.target.value); setAnalysis(null); }}
                            />
                        </div>

                        <div>
                            <label className="font-semibold block mb-2 text-slate-700">Concept Summary</label>
                            <textarea
                                className="input-field min-h-[120px]"
                                rows="4"
                                placeholder="Describe the core mechanism to check for duplicates..."
                                value={concept}
                                onChange={(e) => { setConcept(e.target.value); setAnalysis(null); }}
                            ></textarea>
                            <p className="text-xs text-slate-500 mt-1">Min 10 characters required for analysis.</p>
                        </div>

                        <button
                            className="btn-primary w-full py-3 flex justify-center items-center gap-2"
                            onClick={checkAvailability}
                            disabled={!title || concept.length < 10 || checking}
                        >
                            {checking ? 'Analyzing Database with Gemini...' : 'Run Semantic Check'}
                        </button>

                        {/* ANALYSIS RESULTS */}
                        {analysis && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">

                                {/* Summary & Score Header */}
                                <div className="p-4 bg-slate-50 rounded-xl mb-4 border border-slate-200">
                                    <div className="text-sm text-slate-600 italic mb-3 leading-relaxed">
                                        "{analysis.summary}"
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="font-semibold text-slate-900">Similarity Score: {analysis.score}%</div>
                                        {analysis.recommendation === 'Publish' && <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded font-semibold border border-green-500/30">Unique Idea</span>}
                                        {analysis.recommendation === 'Improve' && <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-1 rounded font-semibold border border-amber-500/30">Moderate Overlap</span>}
                                        {analysis.recommendation === 'Collaborate' && <span className="bg-red-500/20 text-red-300 text-xs px-2 py-1 rounded font-semibold border border-red-500/30">Duplicate Detected</span>}
                                    </div>
                                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-1000 ease-out ${analysis.score > 70 ? 'bg-red-500' : (analysis.score > 40 ? 'bg-amber-500' : 'bg-green-500')}`}
                                            style={{ width: `${analysis.score}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Recommendation Action Map */}
                                {analysis.recommendation === 'Collaborate' && (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-red-500/10 border-l-4 border-red-500 rounded-r-lg text-red-200">
                                            <div className="flex items-center gap-2 font-bold mb-1"><Users size={18} /> Recommendation: Collaborate</div>
                                            <p className="text-sm opacity-90">High similarity found. We recommend collaborating instead of duplicating effort.</p>
                                        </div>

                                        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Similar Registered Ideas:</h4>
                                        {analysis.similar.map(sim => (
                                            <div key={sim.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-between items-center">
                                                <div>
                                                    <div className="font-semibold text-slate-900">{sim.title}</div>
                                                    <div className="text-xs text-slate-500">by <span className="text-slate-700">{sim.author}</span></div>
                                                </div>
                                                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200">{sim.match} Match</span>
                                            </div>
                                        ))}

                                        <button className="btn-secondary w-full border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 hover:text-red-300">
                                            Connect with Authors
                                        </button>
                                    </div>
                                )}

                                {analysis.recommendation === 'Improve' && (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-amber-500/10 border-l-4 border-amber-500 rounded-r-lg text-amber-200">
                                            <div className="flex items-center gap-2 font-bold mb-1"><Lightbulb size={18} /> Recommendation: Improve Uniqueness</div>
                                            <p className="text-sm opacity-90">Some overlap detected. highlighting your unique differentiators will help.</p>
                                        </div>
                                        <button className="btn-primary w-full" onClick={() => setStep(2)}>
                                            Proceed to Lock (I have differentiators)
                                        </button>
                                    </div>
                                )}

                                {analysis.recommendation === 'Publish' && (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-green-500/10 border-l-4 border-green-500 rounded-r-lg text-green-200">
                                            <div className="flex items-center gap-2 font-bold mb-1"><CheckCircle size={18} /> Recommendation: Publish / Lock</div>
                                            <p className="text-sm opacity-90">Good to go! This concept appears valid and unique.</p>
                                        </div>
                                        <button className="btn-primary w-full shadow-lg shadow-indigo-500/20" onClick={() => setStep(2)}>
                                            Proceed to Lock Idea
                                        </button>
                                    </div>
                                )}

                            </div>
                        )}
                    </div>
                )}

                {/* --- STEP 2: LOCK DETAILS --- */}
                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex gap-3 items-center pb-4 border-b border-slate-200">
                            <div className="p-2 transition-colors rounded-lg bg-indigo-50">
                                <FileText size={24} className="text-indigo-600" />
                            </div>
                            <span className="text-lg font-semibold text-slate-900">{title}</span>
                        </div>

                        <div>
                            <label className="font-semibold block mb-3 text-slate-700">Lock Duration</label>
                            <div className="grid grid-cols-3 gap-3">
                                {['7', '15', '30'].map(days => (
                                    <div
                                        key={days}
                                        onClick={() => setLockDuration(days)}
                                        className={`
                                            p-4 rounded-xl text-center cursor-pointer transition-all border
                                            ${lockDuration === days
                                                ? 'bg-indigo-100 border-indigo-500 text-indigo-700 shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                                                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                                        `}
                                    >
                                        <strong>{days} Days</strong>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button className="btn-secondary px-6" onClick={() => setStep(1)}>Back</button>
                            <button className="btn-primary flex-1 justify-center shadow-lg shadow-indigo-500/20" onClick={handleRegister}>
                                Confirm & Lock
                            </button>
                        </div>
                    </div>
                )}

                {/* --- STEP 3: SUCCESS --- */}
                {step === 3 && (
                    <div className="text-center py-12 animate-in zoom-in duration-300">
                        <div className="inline-flex p-4 bg-green-50 rounded-full text-green-600 mb-6 border border-green-200 shadow-[0_0_20px_rgba(74,222,128,0.2)]">
                            <CheckCircle size={64} />
                        </div>
                        <h2 className="text-3xl font-bold mb-2 text-slate-900">Idea Secured!</h2>
                        <p className="text-slate-500 mb-8">Locked for <span className="text-slate-900 font-semibold">{lockDuration} days</span>.</p>
                        <div className="text-sm text-slate-400 animate-pulse">Redirecting to profile...</div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default RegisterIdea;
