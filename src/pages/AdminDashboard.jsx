import React, { useState, useEffect } from 'react';
import {
    Users, AlertTriangle, BarChart, Shield, Search,
    MoreVertical, CheckCircle, XCircle, Eye, Trash2,
    TrendingUp, MessageSquare, Rocket, AlertCircle
} from 'lucide-react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
    const { userProfile } = useAuth();
    const [activeTab, setActiveTab] = useState('overview'); // overview, moderation, users
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProblems: 0,
        totalIdeas: 0,
        totalViolations: 0
    });
    const [violations, setViolations] = useState([]);
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userProfile?.role !== 'Admin') return;

        // Fetch Stats
        const fetchStats = async () => {
            const usersSnap = await getDocs(collection(db, 'profiles'));
            const problemsSnap = await getDocs(collection(db, 'problems'));
            const ideasSnap = await getDocs(collection(db, 'ideas'));
            const violationsSnap = await getDocs(collection(db, 'violations'));

            setStats({
                totalUsers: usersSnap.size,
                totalProblems: problemsSnap.size,
                totalIdeas: ideasSnap.size,
                totalViolations: violationsSnap.size
            });
        };

        // Listen to violations
        const vQ = query(collection(db, 'violations'), orderBy('createdAt', 'desc'));
        const unsubViolations = onSnapshot(vQ, (snap) => {
            setViolations(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // Listen to users
        const uQ = query(collection(db, 'profiles'), orderBy('createdAt', 'desc'));
        const unsubUsers = onSnapshot(uQ, (snap) => {
            setRecentUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });

        fetchStats();
        return () => {
            unsubViolations();
            unsubUsers();
        }
    }, [userProfile]);

    const handleResolveViolation = async (vId, status) => {
        await updateDoc(doc(db, 'violations', vId), { status });
    };

    const handleDeleteContent = async (vId, contentId, contentType) => {
        if (window.confirm("Delete this content permanently?")) {
            await deleteDoc(doc(db, contentType.toLowerCase() + 's', contentId));
            await updateDoc(doc(db, 'violations', vId), { status: 'Resolved' });
        }
    };

    if (userProfile?.role !== 'Admin') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Shield size={64} className="text-slate-300" />
                <h2 className="text-2xl font-bold text-slate-900">Access Denied</h2>
                <p className="text-slate-500 text-center max-w-md">You do not have the necessary permissions to view the Admin Dashboard.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Admin Command Center</h1>
                    <p className="text-slate-500">Monitor activity and manage platform integrity.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
                    <Shield className="text-indigo-600" size={20} />
                    <span className="font-semibold text-slate-700">Administrator Access</span>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard label="Total Users" value={stats.totalUsers} icon={<Users className="text-blue-500" />} trend="+12% this week" />
                <StatCard label="Live Problems" value={stats.totalProblems} icon={<AlertCircle className="text-red-500" />} trend="+5 new today" />
                <StatCard label="Active Ideas" value={stats.totalIdeas} icon={<Rocket className="text-emerald-500" />} trend="+8 published" />
                <StatCard label="Flagged Reports" value={stats.totalViolations} icon={<AlertTriangle className="text-amber-500" />} trend="Requires action" />
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 mb-6 gap-8">
                <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Overview" icon={<BarChart size={18} />} />
                <TabButton active={activeTab === 'moderation'} onClick={() => setActiveTab('moderation')} label="Moderation" icon={<AlertTriangle size={18} />} />
                <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} label="User Management" icon={<Users size={18} />} />
            </div>

            {/* Main Content Area */}
            <div className="space-y-6">

                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 glass-panel p-6">
                            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                <TrendingUp size={20} className="text-indigo-600" /> System Growth
                            </h3>
                            <div className="h-64 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400 italic">
                                Enrollment Visualization Placeholder
                            </div>
                        </div>
                        <div className="glass-panel p-6">
                            <h3 className="text-lg font-semibold mb-4">Latest Reports</h3>
                            <div className="space-y-4">
                                {violations.slice(0, 5).map(v => (
                                    <div key={v.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                                        <div className="flex justify-between font-semibold mb-1">
                                            <span className="text-slate-700">{v.contentType}</span>
                                            <span className="text-amber-600 px-2 py-0.5 bg-amber-50 rounded text-[10px] uppercase">{v.status}</span>
                                        </div>
                                        <p className="text-slate-500 line-clamp-1">{v.reason}</p>
                                    </div>
                                ))}
                                <button className="w-full py-2 text-indigo-600 text-sm font-semibold hover:bg-indigo-50 rounded-lg transition-colors mt-2" onClick={() => setActiveTab('moderation')}>
                                    View all reports
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'moderation' && (
                    <div className="glass-panel overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Type</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Reason</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Reported At</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {violations.map(v => (
                                    <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{v.contentType}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{v.reason}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${v.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                {v.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {v.createdAt?.toDate ? v.createdAt.toDate().toLocaleDateString() : 'Dec 28, 2024'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 transition-all" title="View Content">
                                                    <Eye size={18} />
                                                </button>
                                                <button className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 transition-all" onClick={() => handleResolveViolation(v.id, 'Resolved')} title="Resolve">
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 transition-all" onClick={() => handleDeleteContent(v.id, v.contentId, v.contentType)} title="Delete Content">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {violations.length === 0 && (
                            <div className="p-12 text-center text-slate-400">
                                <CheckCircle size={48} className="mx-auto mb-4 text-emerald-100" />
                                <p>No pending violations to review.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="glass-panel overflow-hidden">
                        <div className="p-4 border-b border-slate-200 bg-slate-50 flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input type="text" placeholder="Search users by name, email, or role..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                            </div>
                            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                                Export CSV
                            </button>
                        </div>
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">User</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Role</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Points/Karma</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                                                    {user.fullName?.charAt(0) || user.email?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-slate-900">{user.fullName || 'Anonymous User'}</div>
                                                    <div className="text-xs text-slate-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                                                    user.role === 'Investor' ? 'bg-emerald-100 text-emerald-700' :
                                                        'bg-indigo-100 text-indigo-700'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">842</td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white border border-transparent transition-all">
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon, trend }) => (
    <div className="glass-panel p-6">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
                {React.cloneElement(icon, { size: 24 })}
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider">{trend}</span>
        </div>
        <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
        <div className="text-sm font-medium text-slate-500">{label}</div>
    </div>
);

const TabButton = ({ active, onClick, label, icon }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-all ${active ? 'border-indigo-600 text-indigo-600 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
    >
        {icon}
        {label}
    </button>
);

export default AdminDashboard;
