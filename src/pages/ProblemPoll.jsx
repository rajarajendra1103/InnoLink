import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    AlertCircle, ThumbsUp, CheckCircle, Clock, Trophy,
    ArrowLeft, Lock, Users
} from 'lucide-react';

const ProblemPoll = () => {
    const { id } = useParams(); // In a real app, fetch problem by ID
    const navigate = useNavigate();

    // Mock State
    const [pollStatus, setPollStatus] = useState('active'); // 'active', 'closed'
    const [userVotedFor, setUserVotedFor] = useState(null); // ID of solution user voted for (single vote logic) or array for multiple

    // Mock Data: Problem
    const problem = {
        id: 1,
        title: 'Excessive Plastic Waste in Urban Waterways',
        author: 'Sarah Jenkins',
        description: 'Urban rivers are clogged with micro-plastics. We are looking for cost-effective, scalable filtration or skimming solutions that require minimal maintenance.',
        deadline: '2 days left',
        totalVotes: 156
    };

    // Mock Data: Submitted Solutions (Poll Options)
    const [solutions, setSolutions] = useState([
        { id: 101, title: 'RiverCleaner V2 Drone', author: 'TechStream', votes: 85, isPrototype: true },
        { id: 102, title: 'Bio-Filter Mesh Nets', author: 'GreenLabs', votes: 42, isPrototype: false },
        { id: 103, title: 'Community Cleanup App', author: 'SocialGood', votes: 29, isPrototype: true },
    ]);

    const handleVote = (solId) => {
        if (pollStatus === 'closed') return;

        if (userVotedFor === solId) {
            // Unvote
            setUserVotedFor(null);
            setSolutions(prev => prev.map(s => s.id === solId ? { ...s, votes: s.votes - 1 } : s));
        } else {
            // Vote (Switching vote allowed for demo)
            setUserVotedFor(solId);
            setSolutions(prev => prev.map(s => {
                if (s.id === solId) return { ...s, votes: s.votes + 1 };
                if (s.id === userVotedFor) return { ...s, votes: s.votes - 1 }; // Remove vote from prev choice
                return s;
            }));
        }
    };

    const closePoll = () => {
        setPollStatus('closed');
    };

    // Sorting for display (Ranking)
    const sortedSolutions = [...solutions].sort((a, b) => b.votes - a.votes);
    const leadingVotes = sortedSolutions[0].votes;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">

            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-4 transition-colors"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
                <ArrowLeft size={18} /> Back to Feed
            </button>

            {/* Problem Header Card */}
            <div className="glass-panel p-6 mb-8 border-l-4 border-red-500">
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                        <AlertCircle size={18} /> PROBLEM STATEMENT
                    </div>
                    <div className="text-sm text-slate-500">
                        Posted by {problem.author}
                    </div>
                </div>
                <h1 className="text-2xl font-bold mb-3 text-slate-900">{problem.title}</h1>
                <p className="text-lg leading-relaxed text-slate-600 mb-6">
                    {problem.description}
                </p>

                <div className="bg-slate-50 p-4 rounded-xl flex justify-between items-center border border-slate-200">
                    <div className="flex gap-6">
                        <div className="flex items-center gap-2 text-slate-900 font-medium">
                            <Users size={20} className="text-indigo-600" /> <strong>{problem.totalVotes + (userVotedFor ? 1 : 0)}</strong> Community Votes
                        </div>
                        <div className="flex items-center gap-2 text-slate-700">
                            <Clock size={20} className={pollStatus === 'closed' ? 'text-red-500' : 'text-amber-500'} />
                            {pollStatus === 'closed' ? <span className="text-red-600 font-bold">Voting Closed</span> : <span>Voting Active • {problem.deadline}</span>}
                        </div>
                    </div>

                    {/* Admin/Owner Control */}
                    {pollStatus === 'active' && (
                        <button onClick={closePoll} className="btn-secondary text-sm border-red-200 text-red-600 hover:bg-red-50">
                            <Lock size={14} className="mr-1.5" /> Close Poll & Finalize
                        </button>
                    )}
                </div>
            </div>

            {/* Poll Section */}
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-900">
                Submitted Solutions
                <span className="text-base font-normal text-slate-500">(Ranked by Community)</span>
            </h2>

            <div className="flex flex-col gap-4">
                {sortedSolutions.map((sol, index) => {
                    const isWinner = pollStatus === 'closed' && index === 0;
                    const isLeading = pollStatus === 'active' && index === 0;
                    const percentage = Math.round((sol.votes / (problem.totalVotes + (userVotedFor ? 1 : 0))) * 100);

                    return (
                        <div
                            key={sol.id}
                            className={`
                                relative p-6 rounded-xl transition-all duration-300
                                ${isWinner ? 'bg-amber-50 border-2 border-amber-300' : isLeading ? 'bg-indigo-50/50 border-2 border-indigo-200' : 'bg-white border border-slate-200'}
                            `}
                        >
                            {isWinner && (
                                <div className="absolute -top-3 right-6 bg-amber-400 text-white px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-sm">
                                    <Trophy size={14} /> COMMUNITY CHOICE
                                </div>
                            )}

                            <div className="flex gap-6 items-center">
                                {/* Rank Number */}
                                <div className={`
                                    text-3xl font-black w-10 text-center
                                    ${isWinner ? 'text-amber-500' : 'text-slate-300'}
                                `}>
                                    {index + 1}
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="text-lg font-bold text-slate-900">{sol.title}</h3>
                                        {sol.isPrototype && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded font-semibold border border-blue-200">Prototype Ready</span>}
                                    </div>
                                    <div className="text-slate-500 text-sm mb-3">
                                        Proposed by {sol.author}
                                    </div>

                                    {/* Progress Bar Visual */}
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                                        <div
                                            className={`h-full transition-all duration-500 ease-out ${isWinner ? 'bg-amber-400' : 'bg-indigo-500'}`}
                                            style={{
                                                width: `${percentage}%`
                                            }}
                                        ></div>
                                    </div>
                                    <div className="text-xs text-slate-500 font-medium">
                                        <strong>{sol.votes} votes</strong> ({percentage}% of total)
                                    </div>
                                </div>

                                {/* Vote Action */}
                                <button
                                    onClick={() => handleVote(sol.id)}
                                    disabled={pollStatus === 'closed'}
                                    className={`
                                        flex flex-col items-center gap-1 p-3 rounded-xl min-w-[80px] transition-all border-2
                                        ${userVotedFor === sol.id
                                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                            : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600'}
                                        ${pollStatus === 'closed' ? 'opacity-50 cursor-default' : 'cursor-pointer'}
                                    `}
                                >
                                    <ThumbsUp size={24} fill={userVotedFor === sol.id ? 'currentColor' : 'none'} />
                                    <span className="font-bold text-sm">{userVotedFor === sol.id ? 'Voted' : 'Vote'}</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export default ProblemPoll;
