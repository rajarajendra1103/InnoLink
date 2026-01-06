import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Copy, Bookmark, Flag, Image, MoreVertical, EyeOff, Ban
} from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, deleteDoc, increment, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { toggleLike, addComment } from '../services/firebaseService';

const Home = () => {
    const { currentUser, userProfile } = useAuth();
    const navigate = useNavigate();
    const [feedItems, setFeedItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Active State Management
    const [likedPosts, setLikedPosts] = useState({});
    const [activeMenu, setActiveMenu] = useState(null);

    // Edit & Poll State
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState({ title: '', summary: '' });
    const [pollModeId, setPollModeId] = useState(null);
    const [pollData, setPollData] = useState({ question: 'Which solution fits best?', options: ['Option A', 'Option B'] });

    // --- COMMENTS STATE ---
    const [expandedComments, setExpandedComments] = useState({}); // { postId: true/false }
    const [commentInput, setCommentInput] = useState({}); // { postId: "text" }
    const [postComments, setPostComments] = useState({});

    useEffect(() => {
        // Fetch all types of posts and merge them
        // For production, a merged collection or an Algolia search index is better.
        // For MVP, we'll listen to multiple collections and sort.
        const collections = ['problems', 'ideas', 'solutions'];
        const unsubscribes = collections.map(colName => {
            const q = query(collection(db, colName), orderBy('createdAt', 'desc'));
            return onSnapshot(q, (snapshot) => {
                const items = snapshot.docs.map(doc => ({
                    id: doc.id,
                    type: colName.slice(0, -1).charAt(0).toUpperCase() + colName.slice(0, -1).slice(1),
                    ...doc.data()
                }));

                setFeedItems(prev => {
                    const filtered = prev.filter(p => !items.find(i => i.id === p.id));
                    const combined = [...filtered, ...items].sort((a, b) => {
                        const timeA = a.createdAt?.seconds || 0;
                        const timeB = b.createdAt?.seconds || 0;
                        return timeB - timeA;
                    });
                    return combined;
                });
                setLoading(false);
            });
        });

        // Also fetch user likes
        let likesUnsubscribe = () => { };
        if (currentUser) {
            const likesQ = query(collection(db, 'likes'), where('userId', '==', currentUser.uid));
            likesUnsubscribe = onSnapshot(likesQ, (snapshot) => {
                const likes = {};
                snapshot.docs.forEach(doc => {
                    likes[doc.data().postId] = true;
                });
                setLikedPosts(likes);
            });
        }

        return () => {
            unsubscribes.forEach(u => u());
            likesUnsubscribe();
        };
    }, [currentUser]);

    // Fetch comments for expanded posts
    useEffect(() => {
        const postIds = Object.keys(expandedComments).filter(id => expandedComments[id]);
        const unsubs = postIds.map(postId => {
            const q = query(collection(db, 'comments'), where('postId', '==', postId), orderBy('createdAt', 'asc'));
            return onSnapshot(q, (snapshot) => {
                const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPostComments(prev => ({ ...prev, [postId]: comments }));
            });
        });
        return () => unsubs.forEach(u => u());
    }, [expandedComments]);

    const handleLikeAction = async (id, type) => {
        if (!currentUser) return alert("Please login to like posts");
        const isLiked = !!likedPosts[id];
        await toggleLike(id, type, currentUser.uid, isLiked);
    };

    const handleDelete = async (id, type) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            await deleteDoc(doc(db, type.toLowerCase() + 's', id));
            setActiveMenu(null);
        }
    };

    const startEdit = (item) => {
        setEditingId(item.id);
        setEditContent({ title: item.title, summary: item.summary });
        setActiveMenu(null);
    };

    const saveEdit = async (id, type) => {
        const postRef = doc(db, type.toLowerCase() + 's', id);
        await updateDoc(postRef, { title: editContent.title, summary: editContent.summary });
        setEditingId(null);
    };

    const toggleMenu = (id) => { setActiveMenu(activeMenu === id ? null : id); };
    const startPoll = (id) => { setPollModeId(id); setActiveMenu(null); };

    const savePoll = async (id) => {
        await addDoc(collection(db, 'polls'), {
            postId: id,
            question: pollData.question,
            options: pollData.options,
            createdAt: serverTimestamp(),
            voters: []
        });
        setPollModeId(null);
        alert("Poll attached!");
    };

    const handleCopyLink = (postId) => {
        const url = `${window.location.origin}/post/${postId}`;
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
        setActiveMenu(null);
    };

    const handleSavePost = (postId) => {
        // Mock save functionality
        alert("Post saved to your bookmarks!");
        setActiveMenu(null);
    };

    const handleReport = (postId) => {
        if (window.confirm("Do you want to report this post for violating community standards?")) {
            alert("Thank you. Our team will review this content.");
        }
        setActiveMenu(null);
    };

    const handleHidePost = (postId) => {
        setFeedItems(prev => prev.filter(p => p.id !== postId));
        setActiveMenu(null);
    };

    const handleBlockUser = (author) => {
        if (window.confirm(`Block all content from ${author}?`)) {
            setFeedItems(prev => prev.filter(p => p.author !== author));
            alert(`${author} has been blocked.`);
        }
        setActiveMenu(null);
    };

    const toggleComments = (id) => {
        setExpandedComments(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleCommentSubmit = async (id, type) => {
        const text = commentInput[id];
        if (!text || text.trim() === '' || !currentUser) return;

        await addComment(id, type, {
            author: userProfile?.fullName || currentUser.email,
            authorId: currentUser.uid,
            text: text
        });

        setCommentInput(prev => ({ ...prev, [id]: '' }));
    };

    const getIcon = (type) => {
        switch (type) {
            case 'Problem': return <AlertCircle size={18} className="text-red-500" />;
            case 'Idea': return <Lightbulb size={18} className="text-blue-500" />;
            case 'Solution': return <Rocket size={18} className="text-green-500" />;
            default: return null;
        }
    };
    const getBadgeColor = (type) => {
        switch (type) {
            case 'Problem': return 'bg-red-50 text-red-600 border border-red-200';
            case 'Idea': return 'bg-blue-50 text-blue-600 border border-blue-200';
            case 'Solution': return 'bg-green-50 text-green-600 border border-green-200';
            default: return 'bg-slate-100 text-slate-500';
        }
    };

    if (loading && feedItems.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <RefreshCw className="animate-spin text-indigo-600" size={40} />
                    <p className="text-slate-500 font-medium">Loading your feed...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl" onClick={() => setActiveMenu(null)}>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Main Feed Column */}
                <div className="lg:col-span-3">
                    {/* Quick Post Card */}
                    {currentUser && (
                        <div className="glass-panel p-5 mb-6 bg-white/80 backdrop-blur-md border-indigo-50 shadow-sm hover:shadow-md transition-all">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex-shrink-0 flex items-center justify-center font-bold text-white shadow-inner">
                                    {currentUser.email?.charAt(0).toUpperCase()}
                                </div>
                                <button
                                    onClick={() => navigate('/post')}
                                    className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full px-5 text-left text-slate-500 text-sm font-medium transition-colors"
                                >
                                    Share an innovative idea or report a problem...
                                </button>
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                                <div className="flex gap-1">
                                    <button onClick={() => navigate('/post')} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition-colors">
                                        <Lightbulb size={18} />
                                        <span className="text-xs font-semibold">Idea</span>
                                    </button>
                                    <button onClick={() => navigate('/post')} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors">
                                        <AlertCircle size={18} />
                                        <span className="text-xs font-semibold">Problem</span>
                                    </button>
                                    <button onClick={() => navigate('/post')} className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors">
                                        <Rocket size={18} />
                                        <span className="text-xs font-semibold">Solution</span>
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => navigate('/post')} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-all" title="Add Image">
                                        <Image size={20} />
                                    </button>
                                    <button onClick={() => navigate('/post')} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-all" title="Attach Files">
                                        <Link2 size={20} />
                                    </button>
                                    <button onClick={() => navigate('/post')} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-all" title="Create Poll">
                                        <BarChart2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notification Banner */}
                    <div className="rounded-2xl shadow-sm border overflow-hidden p-4 mb-6 flex items-center gap-3 bg-emerald-50 border-emerald-200">
                        <Bell size={20} className="text-emerald-600" />
                        <div className="text-sm text-emerald-900"><strong>New Notification:</strong> Your problem "Urban Smog" was tagged in a new Solution by <strong className="text-emerald-700">@EcoLabs</strong>.</div>
                    </div>

                    {/* Feed Items */}
                    <div className="space-y-6">
                        {feedItems.length === 0 && (
                            <div className="glass-panel p-10 text-center">
                                <Rocket size={48} className="mx-auto text-slate-300 mb-4" />
                                <h3 className="text-xl font-semibold text-slate-900 mb-2">No posts yet</h3>
                                <p className="text-slate-500">Be the first to share a problem or an idea!</p>
                                <Link to="/post" className="btn-primary inline-flex mt-6">Share Something</Link>
                            </div>
                        )}
                        {feedItems.map(item => (
                            <div key={item.id} className="glass-panel">

                                {/* Header & Content */}
                                <div className="p-6 border-b border-slate-200">

                                    {/* Linked Header */}
                                    {item.linkedTo && (
                                        <div className="inline-flex items-center gap-2 text-xs text-indigo-600 mb-4 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200">
                                            <Link2 size={14} />
                                            <span>
                                                {item.type === 'Idea' ? 'Proposed for problem: ' : 'Solving problem: '}
                                                <Link to={`/post/${item.linkedTo.id}`} className="font-semibold text-indigo-700 hover:text-indigo-900 transition-colors pointer-events-auto z-10">{item.linkedTo.title}</Link>
                                            </span>
                                        </div>
                                    )}

                                    {/* Edit Mode Content */}
                                    {editingId === item.id ? (
                                        <div className="flex flex-col gap-3">
                                            <input className="input-field font-bold" value={editContent.title} onChange={(e) => setEditContent({ ...editContent, title: e.target.value })} />
                                            <textarea className="input-field" rows="3" value={editContent.summary} onChange={(e) => setEditContent({ ...editContent, summary: e.target.value })} />
                                            <div className="flex gap-2 justify-end">
                                                <button className="btn-secondary text-sm py-1.5 px-3 flex items-center gap-2" onClick={() => setEditingId(null)}><X size={14} /> Cancel</button>
                                                <button className="btn-primary text-sm py-1.5 px-3 flex items-center gap-2" onClick={() => saveEdit(item.id, item.type)}><Check size={14} /> Save Changes</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-slate-500">
                                                        {item.author?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-slate-900">{item.author}</h4>
                                                        <span className="text-xs text-slate-500">{item.role} • {item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${getBadgeColor(item.type)}`}>
                                                        {getIcon(item.type)} {item.type.toUpperCase()}
                                                    </span>

                                                    <div className="relative">
                                                        <button className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-full hover:bg-indigo-50 transition-all" onClick={(e) => { e.stopPropagation(); toggleMenu(item.id); }}>
                                                            <MoreVertical size={20} />
                                                        </button>
                                                        {activeMenu === item.id && (
                                                            <div className="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl w-56 z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-100" onClick={(e) => e.stopPropagation()}>
                                                                <div className="p-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Post Options</span>
                                                                </div>
                                                                <div className="py-1">
                                                                    {(currentUser?.uid === item.authorId || userProfile?.role === 'Admin') && (
                                                                        <>
                                                                            <div onClick={() => startEdit(item)} className="px-4 py-2.5 text-sm flex items-center gap-3 cursor-pointer hover:bg-indigo-50 text-slate-700 font-medium transition-colors"><Edit size={16} className="text-indigo-500" /> Edit Post</div>
                                                                            <div onClick={() => startPoll(item.id)} className="px-4 py-2.5 text-sm flex items-center gap-3 cursor-pointer hover:bg-indigo-50 text-slate-700 font-medium transition-colors"><BarChart2 size={16} className="text-indigo-500" /> Attached Poll</div>
                                                                            <div onClick={() => handleDelete(item.id, item.type)} className="px-4 py-2.5 text-sm flex items-center gap-3 cursor-pointer hover:bg-red-50 text-red-600 font-medium transition-colors border-b border-slate-100"><Trash size={16} /> Delete Forever</div>
                                                                        </>
                                                                    )}
                                                                    <div onClick={() => handleCopyLink(item.id)} className="px-4 py-2.5 text-sm flex items-center gap-3 cursor-pointer hover:bg-slate-50 text-slate-700 font-medium transition-colors"><Copy size={16} className="text-slate-400" /> Copy Post Link</div>
                                                                    <div onClick={() => handleSavePost(item.id)} className="px-4 py-2.5 text-sm flex items-center gap-3 cursor-pointer hover:bg-slate-50 text-slate-700 font-medium transition-colors"><Bookmark size={16} className="text-slate-400" /> Bookmark Post</div>
                                                                    <div onClick={() => handleHidePost(item.id)} className="px-4 py-2.5 text-sm flex items-center gap-3 cursor-pointer hover:bg-slate-50 text-slate-700 font-medium transition-colors"><EyeOff size={16} className="text-slate-400" /> Hide this post</div>
                                                                    <div onClick={() => handleBlockUser(item.author)} className="px-4 py-2.5 text-sm flex items-center gap-3 cursor-pointer hover:bg-slate-50 text-slate-700 font-medium transition-colors border-t border-slate-100"><Ban size={16} className="text-slate-400" /> Block {item.author?.split(' ')[0]}</div>
                                                                    <div onClick={() => handleReport(item.id)} className="px-4 py-2.5 text-sm flex items-center gap-3 cursor-pointer hover:bg-red-50 text-red-500 font-medium transition-colors mt-1"><Flag size={16} /> Report Content</div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-bold mb-3 text-slate-900 leading-tight">{item.title}</h3>
                                            <p className="text-slate-600 text-sm leading-relaxed">{item.summary || item.description}</p>
                                        </>
                                    )}

                                    {pollModeId === item.id && (
                                        <div className="mt-4 p-4 bg-sky-50 rounded-xl border border-sky-200">
                                            <h4 className="text-sm font-semibold text-sky-700 mb-2">Attach Quick Poll</h4>
                                            <input className="input-field mb-2" value={pollData.question} onChange={(e) => setPollData({ ...pollData, question: e.target.value })} />
                                            <div className="flex gap-2 justify-end">
                                                <button className="btn-secondary text-xs py-1 px-2" onClick={() => setPollModeId(null)}>Cancel</button>
                                                <button className="btn-primary text-xs py-1 px-2" onClick={() => savePoll(item.id)}>Publish Poll</button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-2 mt-4 flex-wrap">
                                        {item.tags && item.tags.map(tag => (<span key={tag} className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">{tag}</span>))}
                                    </div>
                                </div>

                                {/* Card Actions */}
                                <div className={`px-6 py-3 bg-slate-50 flex justify-between items-center ${expandedComments[item.id] ? 'border-b border-slate-200' : ''}`}>
                                    <div className="flex gap-6">
                                        <button className={`flex items-center gap-1.5 text-sm transition-all ${likedPosts[item.id] ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-800'}`} onClick={(e) => { e.stopPropagation(); handleLikeAction(item.id, item.type); }}>
                                            <ThumbsUp size={18} fill={likedPosts[item.id] ? "currentColor" : "none"} /> {item.engagement?.likes || 0}
                                        </button>

                                        <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800" onClick={() => toggleComments(item.id)}>
                                            <MessageSquare size={18} /> {item.engagement?.comments || 0}
                                        </button>

                                        <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800" onClick={(e) => { e.stopPropagation(); }}>
                                            <RefreshCw size={18} /> Repost
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {item.type === 'Problem' && (<Link to={`/poll/${item.id}`} className="btn-primary text-xs py-1.5 px-3">View Poll</Link>)}
                                        {item.type === 'Idea' && <button className="btn-secondary text-xs py-1.5 px-3">View Context</button>}
                                    </div>
                                </div>

                                {/* Comments Section */}
                                {expandedComments[item.id] && (
                                    <div className="bg-slate-50 p-4 animate-in fade-in slide-in-from-top-2 duration-200 border-t border-slate-200">
                                        {/* Existing Comments */}
                                        <div className="space-y-3 mb-4">
                                            {(postComments[item.id] || []).length > 0 ? (
                                                postComments[item.id].map(comment => (
                                                    <div key={comment.id} className="flex gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                            {comment.author?.charAt(0)}
                                                        </div>
                                                        <div className="bg-white p-3 rounded-r-xl rounded-bl-xl border border-slate-200 flex-1 shadow-sm">
                                                            <div className="flex justify-between mb-1">
                                                                <span className="font-semibold text-xs text-indigo-600">{comment.author}</span>
                                                                <span className="text-[10px] text-slate-400">{comment.createdAt?.seconds ? new Date(comment.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}</span>
                                                            </div>
                                                            <p className="text-sm text-slate-700">{comment.text}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center text-slate-500 italic text-sm py-2">No comments yet. Be the first!</div>
                                            )}
                                        </div>

                                        {/* Input Area */}
                                        {currentUser && (
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    className="input-field py-2 text-sm"
                                                    placeholder="Write a comment..."
                                                    value={commentInput[item.id] || ''}
                                                    onChange={(e) => setCommentInput(prev => ({ ...prev, [item.id]: e.target.value }))}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(item.id, item.type)}
                                                />
                                                <button
                                                    className="btn-primary px-3 py-2 flex items-center justify-center"
                                                    onClick={() => handleCommentSubmit(item.id, item.type)}
                                                    disabled={!commentInput[item.id]}
                                                >
                                                    <Send size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="flex flex-col gap-6">
                    <div className="glass-panel p-6">
                        <h3 className="text-lg font-semibold mb-4 text-slate-900 flex items-center gap-2"><BarChart2 size={18} className="text-indigo-600" /> Trending</h3>
                        <div className="flex flex-wrap gap-2">
                            {['#AI', '#ClimateChange', '#Blockchain', '#EdTech'].map(tag => (
                                <span key={tag} className="bg-white hover:bg-slate-50 px-3 py-1.5 rounded-full text-xs text-slate-700 border border-slate-200 cursor-pointer transition-colors shadow-sm">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Home;
