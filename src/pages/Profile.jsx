import React, { useState, useEffect } from 'react';
import {
    User, Briefcase, Star, Clock, Lock, FileText,
    Settings, Bookmark, Edit3, Plus, Save, X,
    MapPin, Mail, Globe, Eye, EyeOff, Shield,
    Linkedin, Github, Link as LinkIcon, ExternalLink,
    Award, TrendingUp, AlertTriangle, CheckCircle, Tag,
    Building, DollarSign, BarChart2, PieChart, Users, ChevronDown, Rocket, Lightbulb
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc, orderBy } from 'firebase/firestore';

const Profile = () => {
    const { currentUser, userProfile } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    const [profileData, setProfileData] = useState({
        fullName: '',
        username: '',
        email: '',
        tagline: '',
        about: '',
        skills: '',
        city: '',
        country: '',
        role: ''
    });

    const [userItems, setUserItems] = useState({
        ideas: [],
        solutions: [],
        problems: [],
        registrations: []
    });

    useEffect(() => {
        console.log("Profile component mounted. User:", currentUser?.uid);

        if (!currentUser) return;

        if (userProfile) {
            setProfileData({
                fullName: userProfile.fullName || '',
                username: userProfile.username || '',
                email: currentUser.email || '',
                tagline: userProfile.tagline || '',
                about: userProfile.about || '',
                skills: userProfile.skills || '',
                city: userProfile.location?.city || '',
                country: userProfile.location?.country || '',
                role: userProfile.role || 'Innovator'
            });
            fetchData();
        }
    }, [currentUser, userProfile]);

    const fetchData = async () => {
        if (!currentUser) return;
        setLoading(true);
        console.log("Fetching data for profile...");
        try {
            const collections = ['problems', 'ideas', 'solutions', 'ideaRegistrations'];
            const results = await Promise.all(collections.map(async (col) => {
                try {
                    const q = query(collection(db, col), where('authorId', '==', currentUser.uid), orderBy('createdAt', 'desc'));
                    return await getDocs(q);
                } catch (colErr) {
                    console.error(`Error fetching collection ${col}:`, colErr);
                    return { docs: [] }; // Fallback to empty docs
                }
            }));

            setUserItems({
                problems: (results[0]?.docs || []).map(d => ({ id: d.id, ...d.data(), type: 'Problem' })),
                ideas: (results[1]?.docs || []).map(d => ({ id: d.id, ...d.data(), type: 'Idea' })),
                solutions: (results[2]?.docs || []).map(d => ({ id: d.id, ...d.data(), type: 'Solution' })),
                registrations: (results[3]?.docs || []).map(d => ({ id: d.id, ...d.data() }))
            });
        } catch (err) {
            console.error("Critical error in fetchData:", err);
        }
        setLoading(false);
    };

    if (!currentUser) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <div className="glass-panel p-10 max-w-md mx-auto">
                    <Shield size={64} className="text-slate-200 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Identity Required</h2>
                    <p className="text-slate-600 mb-6">Please sign in to view and manage your professional profile.</p>
                    <Link to="/login" className="btn-primary inline-block px-10">Sign In</Link>
                </div>
            </div>
        );
    }

    const handleSaveProfile = async () => {
        try {
            const profileRef = doc(db, 'profiles', currentUser.uid);
            await updateDoc(profileRef, {
                fullName: profileData.fullName,
                username: profileData.username,
                tagline: profileData.tagline,
                about: profileData.about,
                skills: profileData.skills,
                location: {
                    city: profileData.city,
                    country: profileData.country
                }
            });
            setIsEditing(false);
            alert("Profile updated!");
        } catch (err) {
            console.error("Error updating profile:", err);
            alert("Failed to update profile.");
        }
    };

    const handleFieldChange = (field, value) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">

            {/* View As Switcher (Simplified for now - role is fixed) */}
            <div className="flex justify-end mb-6">
                <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
                    <Shield className="text-indigo-600" size={18} />
                    <span className="text-sm font-semibold text-slate-700">Role: {profileData.role}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">

                {/* LEFT COLUMN - PROFILE CARD */}
                <div className="lg:col-span-3">
                    <div className="glass-panel p-6 md:p-8">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            {/* Avatar */}
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0 bg-indigo-50 text-indigo-500`}>
                                {profileData.role === 'Investor' ? <Building size={40} /> : <User size={40} />}
                            </div>

                            <div className="flex-1 w-full">
                                {isEditing ? (
                                    <div className="space-y-4 animate-in fade-in">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs text-slate-500">Full Name</label>
                                                <input className="input-field" placeholder="Full Name" value={profileData.fullName} onChange={(e) => handleFieldChange('fullName', e.target.value)} />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs text-slate-500">Username</label>
                                                <input className="input-field" placeholder="Username" value={profileData.username} onChange={(e) => handleFieldChange('username', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-slate-500">Tagline</label>
                                            <textarea className="input-field min-h-[80px]" placeholder="Your professional tagline..." value={profileData.tagline} onChange={(e) => handleFieldChange('tagline', e.target.value)} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-slate-500">Skills (Optional)</label>
                                            <input className="input-field" placeholder="React, AI, Design..." value={profileData.skills} onChange={(e) => handleFieldChange('skills', e.target.value)} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs text-slate-500">City</label>
                                                <input className="input-field" placeholder="City" value={profileData.city} onChange={(e) => handleFieldChange('city', e.target.value)} />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs text-slate-500">Country</label>
                                                <input className="input-field" placeholder="Country" value={profileData.country} onChange={(e) => handleFieldChange('country', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="flex gap-3 justify-end mt-4">
                                            <button onClick={() => setIsEditing(false)} className="btn-secondary flex items-center gap-2 px-6 py-2">
                                                <X size={16} /> Cancel
                                            </button>
                                            <button onClick={handleSaveProfile} className="btn-primary flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700">
                                                <Save size={16} /> Save Changes
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                                            <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-900">
                                                {profileData.fullName || 'Anonymous User'}
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${profileData.role === 'Investor' ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                                    {profileData.role}
                                                </span>
                                            </h1>
                                            <button onClick={() => setIsEditing(true)} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-2 self-start border-slate-200">
                                                <Edit3 size={14} /> Edit Profile
                                            </button>
                                        </div>

                                        <p className="text-slate-600 text-lg mb-4 leading-relaxed font-light">
                                            {profileData.tagline || 'No tagline set yet.'}
                                        </p>

                                        <div className="flex flex-wrap gap-4 md:gap-6 text-sm text-slate-500">
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} className="text-slate-400" />
                                                {(profileData.city || profileData.country) ? `${profileData.city}, ${profileData.country}` : 'No location set'}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail size={16} className="text-slate-400" /> {profileData.email}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - STATS */}
                <div className="lg:col-span-1">
                    <div className="glass-panel p-6 h-full flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-indigo-600">
                                <TrendingUp size={20} /> Impact
                            </h3>
                            <div className="bg-white border border-slate-200 rounded-xl p-4 text-center mb-6 shadow-sm">
                                <div className="text-3xl font-bold text-indigo-600">
                                    {(userItems.problems.length + userItems.ideas.length + userItems.solutions.length) * 10}
                                </div>
                                <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Karma Score</div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm text-slate-600 border-b border-slate-100 pb-2">
                                    <span>Ideas</span> <span className="font-semibold text-slate-900">{userItems.ideas.length}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-600 border-b border-slate-100 pb-2">
                                    <span>Problems</span> <span className="font-semibold text-slate-900">{userItems.problems.length}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-600 border-b border-slate-100 pb-2">
                                    <span>Solutions</span> <span className="font-semibold text-slate-900">{userItems.solutions.length}</span>
                                </div>
                            </div>
                        </div>
                        {profileData.role === 'Investor' && (
                            <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-100">
                                <div className="text-xs text-green-700 font-bold uppercase mb-1">Active Investor</div>
                                <p className="text-[10px] text-green-600">Accessing premium analytics and discovery tools.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* DASHBOARD TABS */}
            <div>
                <div className="flex border-b border-slate-200 mb-6 gap-6 overflow-x-auto scrollbar-hide">
                    {[
                        { id: 'dashboard', label: 'Overview', icon: <BarChart2 size={16} /> },
                        { id: 'ideas', label: 'My Ideas', icon: <Lightbulb size={16} /> },
                        { id: 'registrations', label: 'Locked Concept', icon: <Lock size={16} /> },
                        { id: 'solutions', label: 'Solutions', icon: <CheckCircle size={16} /> },
                        { id: 'problems', label: 'Reported Problems', icon: <AlertTriangle size={16} /> },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-3 text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 px-1 ${activeTab === tab.id
                                ? 'text-indigo-600 border-b-2 border-indigo-600'
                                : 'text-slate-500 hover:text-slate-800'
                                }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                <div className="min-h-[300px]">
                    {loading ? (
                        <div className="flex items-center justify-center p-12">
                            <Rocket className="animate-bounce text-indigo-400" size={32} />
                        </div>
                    ) : (
                        <>
                            {activeTab === 'dashboard' && (
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="glass-panel p-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="font-semibold text-lg flex items-center gap-2"><Star size={18} className="text-yellow-500" /> Recent Content</h3>
                                            <Link to="/post" className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"><Plus size={12} /> New Post</Link>
                                        </div>
                                        <div className="space-y-3">
                                            {[...userItems.ideas, ...userItems.problems].slice(0, 3).map(item => (
                                                <div key={item.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white hover:border-slate-300 transition-all cursor-pointer">
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-sm font-bold text-slate-800">{item.title || item.description?.substring(0, 40) + '...'}</div>
                                                        <span className="text-[10px] uppercase font-bold text-slate-400">{item.type}</span>
                                                    </div>
                                                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                                                        {item.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                                                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                        <span className="text-indigo-500">{item.engagement?.likes || 0} Likes</span>
                                                    </div>
                                                </div>
                                            ))}
                                            {[...userItems.ideas, ...userItems.problems].length === 0 && (
                                                <div className="text-center py-6 text-slate-400 text-sm">No recent activity found.</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="glass-panel p-6">
                                        <h3 className="font-semibold text-lg mb-6 flex items-center gap-2"><Shield size={18} className="text-indigo-600" /> Idea Locking (IP Protection)</h3>
                                        <div className="space-y-4">
                                            {userItems.registrations.slice(0, 2).map(reg => (
                                                <div key={reg.id} className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="font-semibold text-sm text-indigo-900">{reg.title}</div>
                                                        <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded uppercase font-bold">Locked</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-indigo-600 font-medium">
                                                        <Clock size={12} /> Expires: {reg.expiryDate?.toDate?.().toLocaleDateString() || 'N/A'}
                                                    </div>
                                                </div>
                                            ))}
                                            {userItems.registrations.length === 0 && (
                                                <div className="text-center py-8">
                                                    <p className="text-slate-500 text-sm mb-4">You haven't locked any concepts yet.</p>
                                                    <Link to="/register-idea" className="text-indigo-600 font-bold hover:underline">Protect an Idea now →</Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'ideas' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {userItems.ideas.map(idea => (
                                        <div key={idea.id} className="glass-panel p-6 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between mb-4">
                                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded uppercase tracking-wider">IDEA</span>
                                                {idea.status === 'published' ? <Globe size={14} className="text-green-500" /> : <Lock size={14} className="text-amber-500" />}
                                            </div>
                                            <h4 className="font-bold text-slate-800 mb-2 truncate">{idea.title}</h4>
                                            <p className="text-sm text-slate-500 line-clamp-2 mb-4">{idea.description}</p>
                                            <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-100 pt-4">
                                                <span>{idea.createdAt?.toDate?.().toLocaleDateString()}</span>
                                                <div className="flex gap-3">
                                                    <span>{idea.engagement?.likes || 0} Likes</span>
                                                    <span>{idea.engagement?.comments || 0} Comments</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {userItems.ideas.length === 0 && (
                                        <div className="col-span-full py-12 text-center text-slate-400">No ideas found. Start innovating!</div>
                                    )}
                                </div>
                            )}

                            {/* ... more tabs can be implemented similar to above ... */}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
