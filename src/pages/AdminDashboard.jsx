import React, { useState, useEffect } from 'react';
import {
    Users, AlertTriangle, BarChart, Shield, Search,
    MoreVertical, CheckCircle, XCircle, Eye, Trash2,
    TrendingUp, MessageSquare, Rocket, AlertCircle,
    UserX, UserCheck, ShieldCheck, History, Info, Lightbulb, Database
} from 'lucide-react';
import { db } from '../firebase';
import {
    collection, query, orderBy, onSnapshot, doc,
    updateDoc, deleteDoc, getDocs, where, addDoc,
    serverTimestamp, limit
} from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { seedDatabase } from '../utils/seedData';

const AdminDashboard = () => {
    const { userProfile, currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('overview'); // overview, moderation, users, logs
    const [isSeeding, setIsSeeding] = useState(false);
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        flaggedUsers: 0,
        blockedUsers: 0,
        totalProblems: 0,
        totalIdeas: 0,
        totalViolations: 0
    });
    const [violations, setViolations] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userProfile || userProfile.role !== 'Admin') return;

        // --- FETCH REAL-TIME STATS & DATA ---

        // Profiles Listener
        const unsubUsers = onSnapshot(collection(db, 'profiles'), (snap) => {
            const userList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(userList);

            setStats(prev => ({
                ...prev,
                totalUsers: userList.length,
                activeUsers: userList.filter(u => u.status === 'active' || !u.status).length,
                flaggedUsers: userList.filter(u => u.violationCount > 2).length,
                blockedUsers: userList.filter(u => u.status === 'blocked').length
            }));
        });

        // Content Listeners (Problems & Ideas) - Simple counts for overview
        const unsubProblems = onSnapshot(collection(db, 'problems'), (snap) => {
            setStats(prev => ({ ...prev, totalProblems: snap.size }));
        });
        const unsubIdeas = onSnapshot(collection(db, 'ideas'), (snap) => {
            setStats(prev => ({ ...prev, totalIdeas: snap.size }));
        });

        // Violations Listener
        const vQ = query(collection(db, 'violations'), orderBy('createdAt', 'desc'));
        const unsubViolations = onSnapshot(vQ, (snap) => {
            setViolations(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setStats(prev => ({ ...prev, totalViolations: snap.size }));
        });

        // Audit Logs Listener
        const lQ = query(collection(db, 'auditLogs'), orderBy('createdAt', 'desc'), limit(50));
        const unsubLogs = onSnapshot(lQ, (snap) => {
            setAuditLogs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });

        return () => {
            unsubUsers();
            unsubProblems();
            unsubIdeas();
            unsubViolations();
            unsubLogs();
        };
    }, [userProfile]);

    // --- ADMIN ACTIONS ---

    const handleSeed = async () => {
        if (isSeeding) return;
        setIsSeeding(true);
        try {
            const result = await seedDatabase();
            if (result === 'Success') {
                alert("Demo data successfully seeded to Firestore!");
                await logAction('SEED_DATABASE', { status: 'success' });
            }
        } catch (err) {
            alert("Seeding failed: " + err.message);
        }
        setIsSeeding(false);
    };

    const logAction = async (action, details) => {
        try {
            await addDoc(collection(db, 'auditLogs'), {
                adminId: currentUser.uid,
                adminName: userProfile.fullName || userProfile.email,
                action,
                details,
                createdAt: serverTimestamp()
            });
        } catch (err) {
            console.error("Failed to log audit action:", err);
        }
    };

    const handleUpdateUserStatus = async (userId, newStatus) => {
        const user = users.find(u => u.id === userId);
        if (window.confirm(`Are you sure you want to ${newStatus === 'blocked' ? 'BLOCK' : 'UNBLOCK'} ${user?.fullName || 'this user'}?`)) {
            await updateDoc(doc(db, 'profiles', userId), { status: newStatus });
            await logAction(newStatus === 'blocked' ? 'BLOCK_USER' : 'UNBLOCK_USER', { userId, email: user?.email });
        }
    };

    const handleDeleteContent = async (vId, contentId, contentType, authorId) => {
        if (window.confirm(`Permanently delete this ${contentType}?`)) {
            try {
                // Delete actual content
                const col = contentType.toLowerCase() + 's';
                await deleteDoc(doc(db, col, contentId));

                // Update user violation count
                const userRef = doc(db, 'profiles', authorId);
                const user = users.find(u => u.id === authorId);
                const newCount = (user?.violationCount || 0) + 1;
                await updateDoc(userRef, { violationCount: newCount });

                // Mark violation as resolved
                await updateDoc(doc(db, 'violations', vId), { status: 'Deleted', resolvedAt: serverTimestamp() });

                await logAction('DELETE_CONTENT', { contentType, contentId, authorId });
            } catch (err) {
                alert("Action failed: " + err.message);
            }
        }
    };

    const handleApproveContent = async (vId) => {
        await updateDoc(doc(db, 'violations', vId), { status: 'Approved', resolvedAt: serverTimestamp() });
        await logAction('APPROVE_CONTENT', { violationId: vId });
    };

    if (!userProfile || userProfile.role !== 'Admin') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Shield size={64} className="text-slate-200" />
                <h2 className="text-2xl font-bold text-slate-800">Administrator Access Required</h2>
                <p className="text-slate-500 text-center max-w-sm">
                    This section is restricted to InnoLink staff. If you are an admin, please ensure your account role is set correctly.
                </p>
                <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-700 text-sm flex gap-3 max-w-md">
                    <Info size={20} className="shrink-0" />
                    <p><strong>Note:</strong> Admin status is managed via the Firestore "profiles" collection for project security.</p>
                </div>
            </div>
        );
    }

    const filteredUsers = users.filter(u =>
        u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500">
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Command Center</h1>
                    <p className="text-slate-500">Platform intelligence, governance, and safety controls.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={handleSeed}
                        disabled={isSeeding}
                        className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-slate-700 shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2 text-sm font-bold"
                    >
                        <Database size={18} className="text-indigo-600" />
                        {isSeeding ? 'Seeding...' : 'Seed Demo Data'}
                    </button>
                    <div className="bg-indigo-600 px-4 py-2 rounded-xl text-white shadow-lg flex items-center gap-2">
                        <ShieldCheck size={20} />
                        <span className="font-bold text-sm">Authenticated System Administrator</span>
                    </div>
                </div>
            </header>

            {/* HIGH-LEVEL METRICS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard label="Total Community" value={stats.totalUsers} icon={<Users className="text-blue-500" />} color="blue" />
                <StatCard label="Flagged Users" value={stats.flaggedUsers} icon={<AlertTriangle className="text-amber-500" />} color="amber" subtext="> 2 violations" />
                <StatCard label="Live Governance" value={stats.totalViolations} icon={<Shield size={28} className="text-indigo-500" />} color="indigo" />
                <StatCard label="Restricted" value={stats.blockedUsers} icon={<UserX className="text-red-500" />} color="red" />
            </div>

            {/* VIEW OPTIONS */}
            <div className="flex border-b border-slate-200 mb-8 gap-1 overflow-x-auto scrollbar-hide">
                <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Overview" icon={<BarChart size={18} />} />
                <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} label="User Monitoring" icon={<Users size={18} />} />
                <TabButton active={activeTab === 'moderation'} onClick={() => setActiveTab('moderation')} label="Content Safety" icon={<AlertCircle size={18} />} />
                <TabButton active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} label="Audit Logs" icon={<History size={18} />} />
            </div>

            <div className="min-h-[400px]">
                {/* --- OVERVIEW TAB --- */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="glass-panel p-6">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <TrendingUp size={20} className="text-indigo-600" /> Platform Growth
                                </h3>
                                <div className="h-64 bg-slate-50 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                                    <BarChart size={48} className="mb-2 opacity-20" />
                                    <p className="text-sm font-medium">Growth analytics visualization loading...</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="glass-panel p-6 border-l-4 border-l-emerald-500">
                                    <h4 className="text-sm font-bold text-slate-500 uppercase mb-4 tracking-wider">Solution Proposals</h4>
                                    <div className="text-4xl font-black text-slate-900">{stats.totalProblems}</div>
                                    <p className="text-xs text-slate-400 mt-2 flex items-center gap-1"><Rocket size={12} /> Live matching active</p>
                                </div>
                                <div className="glass-panel p-6 border-l-4 border-l-indigo-500">
                                    <h4 className="text-sm font-bold text-slate-500 uppercase mb-4 tracking-wider">Idea Pipeline</h4>
                                    <div className="text-4xl font-black text-slate-900">{stats.totalIdeas}</div>
                                    <p className="text-xs text-slate-400 mt-2 flex items-center gap-1"><Lightbulb size={12} /> Global concepts</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="glass-panel p-6">
                                <h3 className="text-lg font-bold mb-4">Urgent Reports</h3>
                                <div className="space-y-3">
                                    {violations.filter(v => v.status === 'Pending').slice(0, 4).map(v => (
                                        <div key={v.id} className="p-3 bg-red-50 border border-red-100 rounded-xl">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-xs font-bold text-red-700 uppercase">{v.contentType}</span>
                                                <span className="text-[10px] text-red-500">{v.createdAt?.toDate?.().toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-slate-700 font-medium line-clamp-2">{v.reason}</p>
                                        </div>
                                    ))}
                                    {violations.filter(v => v.status === 'Pending').length === 0 && (
                                        <div className="text-center py-10">
                                            <CheckCircle className="mx-auto text-emerald-300 mb-2" size={32} />
                                            <p className="text-slate-400 text-sm">System clear. No reports pending.</p>
                                        </div>
                                    )}
                                </div>
                                <button className="w-full mt-4 py-2.5 text-indigo-600 text-sm font-bold hover:bg-indigo-50 rounded-xl transition-all" onClick={() => setActiveTab('moderation')}>
                                    Full Moderation Queue
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- USER MONITORING TAB --- */}
                {activeTab === 'users' && (
                    <div className="glass-panel overflow-hidden border-none shadow-xl">
                        <div className="p-6 bg-white border-b border-slate-100 flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or role..."
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2">
                                    <TrendingUp size={16} /> Activity History
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Global User</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Authority</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Violations</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Standing</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Governance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {filteredUsers.map(user => (
                                        <tr key={user.id} className="hover:bg-indigo-50/30 transition-colors group">
                                            <td className="px-6 py-4 text-sm whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-black text-slate-400 group-hover:from-indigo-100 group-hover:to-indigo-200 group-hover:text-indigo-600 transition-all">
                                                        {user.fullName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900">{user.fullName || 'Anonymous'}</div>
                                                        <div className="text-xs text-slate-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-lg text-xs font-black tracking-wider uppercase border ${user.role === 'Admin' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                    user.role === 'Investor' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                        'bg-indigo-50 text-indigo-700 border-indigo-100'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`font-black text-sm ${user.violationCount > 2 ? 'text-red-600' : 'text-slate-400'}`}>
                                                    {user.violationCount || 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${user.status === 'blocked' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                                                    <span className={`text-xs font-bold uppercase ${user.status === 'blocked' ? 'text-red-700' : 'text-emerald-700'}`}>
                                                        {user.status || 'Active'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Violation History">
                                                        <History size={18} />
                                                    </button>
                                                    {user.status === 'blocked' ? (
                                                        <button
                                                            onClick={() => handleUpdateUserStatus(user.id, 'active')}
                                                            className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
                                                            title="Unblock User"
                                                        >
                                                            <UserCheck size={18} />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleUpdateUserStatus(user.id, 'blocked')}
                                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                            title="Block User"
                                                        >
                                                            <UserX size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- CONTENT MODERATION TAB --- */}
                {activeTab === 'moderation' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {violations.map(v => (
                                <div key={v.id} className="glass-panel p-0 overflow-hidden border-2 border-slate-100 flex flex-col">
                                    <div className={`p-4 ${v.status === 'Pending' ? 'bg-red-50' : 'bg-slate-50'} border-b flex justify-between items-center`}>
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle size={16} className={v.status === 'Pending' ? 'text-red-600' : 'text-slate-400'} />
                                            <span className="text-xs font-black uppercase tracking-widest text-slate-700">{v.contentType} VIOLATION</span>
                                        </div>
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase border ${v.status === 'Pending' ? 'bg-red-100 border-red-200 text-red-700' :
                                            v.status === 'Approved' ? 'bg-emerald-100 border-emerald-200 text-emerald-700' :
                                                'bg-slate-200 border-slate-300 text-slate-600'
                                            }`}>
                                            {v.status}
                                        </span>
                                    </div>
                                    <div className="p-5 flex-1">
                                        <div className="mb-4">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-1 tracking-tighter">Detected Reason</h4>
                                            <p className="text-slate-900 font-medium leading-relaxed">{v.reason}</p>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs">
                                            <div className="flex-1">
                                                <span className="text-slate-400 block mb-0.5 uppercase tracking-tighter">Reported By</span>
                                                <span className="text-slate-700 font-bold">{v.reporterEmail || 'Automated WebGuard'}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-slate-400 block mb-0.5 uppercase tracking-tighter">Date</span>
                                                <span className="text-slate-700 font-bold">{v.createdAt?.toDate?.().toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {v.status === 'Pending' && (
                                        <div className="p-3 bg-slate-50 border-t flex gap-2">
                                            <button
                                                onClick={() => handleApproveContent(v.id)}
                                                className="flex-1 py-1.5 flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-emerald-600 hover:bg-emerald-50 transition-all"
                                            >
                                                <CheckCircle size={14} /> Approve
                                            </button>
                                            <button
                                                onClick={() => handleDeleteContent(v.id, v.contentId, v.contentType, v.authorId)}
                                                className="flex-1 py-1.5 flex items-center justify-center gap-2 bg-red-600 rounded-lg text-xs font-bold text-white hover:bg-red-700 shadow-md transition-all"
                                            >
                                                <Trash2 size={14} /> Remove Content
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {violations.length === 0 && (
                            <div className="py-24 text-center">
                                <ShieldCheck size={80} className="mx-auto text-emerald-100 mb-6" />
                                <h3 className="text-xl font-bold text-slate-900">Safety Clear</h3>
                                <p className="text-slate-500">No content violations currently awaiting review.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* --- AUDIT LOGS TAB --- */}
                {activeTab === 'logs' && (
                    <div className="glass-panel p-0 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Action</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Admin</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Entity Involved</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {auditLogs.map(log => (
                                        <tr key={log.id} className="text-sm">
                                            <td className="px-6 py-4">
                                                <span className="font-black text-indigo-600">{log.action || 'GOVERNANCE_ACTION'}</span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-700 font-bold">{log.adminName}</td>
                                            <td className="px-6 py-4 text-slate-500 truncate max-w-xs">{JSON.stringify(log.details)}</td>
                                            <td className="px-6 py-4 text-slate-400 font-mono text-xs text-right">
                                                {log.createdAt?.toDate?.().toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon, color, subtext }) => {
    const colorMap = {
        blue: 'text-blue-600 bg-blue-50 border-blue-100',
        amber: 'text-amber-600 bg-amber-50 border-amber-100',
        indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100',
        red: 'text-red-600 bg-red-50 border-red-100'
    };

    return (
        <div className="glass-panel p-6 shadow-sm border-slate-100">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-4 rounded-2xl border ${colorMap[color]}`}>
                    {React.cloneElement(icon, { size: 28 })}
                </div>
            </div>
            <div className="text-4xl font-black text-slate-900 mb-1">{value}</div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{label}</div>
            {subtext && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">{subtext}</p>}
        </div>
    );
};

const TabButton = ({ active, onClick, label, icon }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 py-4 px-6 border-b-4 transition-all whitespace-nowrap ${active
            ? 'border-indigo-600 text-indigo-700 font-black'
            : 'border-transparent text-slate-400 hover:text-slate-600 font-bold'
            }`}
    >
        {icon}
        <span className="text-sm uppercase tracking-wider">{label}</span>
    </button>
);

export default AdminDashboard;
