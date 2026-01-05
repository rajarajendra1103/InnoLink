import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Image, Video, FileText, Link as LinkIcon, X,
    AlertCircle, CheckCircle, ChevronDown, Globe, BarChart2,
    AtSign, Link2, Plus, Trash2, Mic, Paperclip, User, Loader2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createProblem, createIdea } from '../services/firebaseService';

const PostPage = () => {
    const { currentUser, userProfile } = useAuth();
    const navigate = useNavigate();
    const [postType, setPostType] = useState('Problem'); // Problem, Idea
    const [text, setText] = useState('');
    const [summary, setSummary] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [loading, setLoading] = useState(false);

    // Feature Toggles
    const [activeFeature, setActiveFeature] = useState(null);

    // Poll State
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState(['', '']);

    // Link State
    const [linkUrl, setLinkUrl] = useState('');

    // Tagging State
    const [tagQuery, setTagQuery] = useState('');
    const [taggedUsers, setTaggedUsers] = useState([]);
    const [mockUserResults, setMockUserResults] = useState([]);

    // Refs
    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);
    const docInputRef = useRef(null);

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const triggerFileUpload = (type) => {
        if (type === 'image') imageInputRef.current.click();
        if (type === 'video') videoInputRef.current.click();
        if (type === 'doc') docInputRef.current.click();
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const id = Date.now();
        const previewUrl = URL.createObjectURL(file);

        setAttachments([...attachments, {
            id, type, name: file.name, file: file, preview: previewUrl
        }]);

        e.target.value = '';
    };

    const removeAttachment = (id) => {
        setAttachments(attachments.filter(a => a.id !== id));
    };

    // --- Poll Logic ---
    const addPollOption = () => {
        if (pollOptions.length < 5) setPollOptions([...pollOptions, '']);
    };
    const updatePollOption = (index, value) => {
        const newOpts = [...pollOptions];
        newOpts[index] = value;
        setPollOptions(newOpts);
    };
    const removePollOption = (index) => {
        const newOpts = pollOptions.filter((_, i) => i !== index);
        setPollOptions(newOpts);
    };

    // --- Submit Logic ---
    const handlePost = async () => {
        if (!currentUser) return alert("Please login to post");
        setLoading(true);
        try {
            const mediaFiles = attachments.filter(a => a.file).map(a => a.file);
            const postData = {
                title: text.split('\n')[0].substring(0, 100),
                description: text,
                summary: summary || text.substring(0, 200),
                author: userProfile?.fullName || currentUser.email,
                authorId: currentUser.uid,
                role: userProfile?.role || 'User',
                tags: text.match(/#\w+/g) || [],
                status: 'published'
            };

            if (postType === 'Problem') {
                await createProblem(postData, mediaFiles);
            } else {
                await createIdea(postData, mediaFiles);
            }

            navigate('/');
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Failed to create post. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const addLink = () => {
        if (linkUrl) {
            setAttachments([...attachments, { id: Date.now(), type: 'link', name: linkUrl }]);
            setLinkUrl('');
            setActiveFeature(null);
        }
    };

    // --- Tagging Logic ---
    const handleTagSearch = (e) => {
        const val = e.target.value;
        setTagQuery(val);
        if (val.length > 0) {
            setMockUserResults([
                { id: 'u1', name: 'Dr. Emily Stone', role: 'Expert' },
                { id: 'u2', name: 'Sarah Jenkins', role: 'Innovator' },
                { id: 'u3', name: 'John Smith', role: 'Investor' },
                { id: 'u4', name: 'David Chen', role: 'Collaborator' }
            ].filter(u => u.name.toLowerCase().includes(val.toLowerCase())));
        } else {
            setMockUserResults([]);
        }
    };
    const addTaggedUser = (user) => {
        if (!taggedUsers.find(u => u.id === user.id)) setTaggedUsers([...taggedUsers, user]);
        setTagQuery('');
        setMockUserResults([]);
    };
    const removeTaggedUser = (id) => {
        setTaggedUsers(taggedUsers.filter(u => u.id !== id));
    };

    useEffect(() => {
        return () => {
            attachments.forEach(att => {
                if (att.preview) URL.revokeObjectURL(att.preview);
            });
        };
    }, [attachments]);

    return (

        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="glass-panel p-0 overflow-hidden">

                {/* Hidden Inputs */}
                <input type="file" ref={imageInputRef} onChange={(e) => handleFileChange(e, 'image')} accept="image/*" className="hidden" />
                <input type="file" ref={videoInputRef} onChange={(e) => handleFileChange(e, 'video')} accept="video/*" className="hidden" />
                <input type="file" ref={docInputRef} onChange={(e) => handleFileChange(e, 'doc')} accept=".pdf,.doc,.docx,.txt" className="hidden" />

                {/* Header */}
                <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-slate-900">Create a post</h2>
                    <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
                </div>

                {/* Scope Selector */}
                <div className="p-4 flex gap-3 items-center">
                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                        {userProfile?.fullName?.charAt(0) || currentUser?.email?.charAt(0) || '?'}
                    </div>
                    <div>
                        <div className="font-semibold text-base text-slate-900">{userProfile?.fullName || currentUser?.email}</div>
                        <div className="flex gap-2 mt-1">
                            <button
                                onClick={() => setPostType(postType === 'Problem' ? 'Idea' : 'Problem')}
                                className="flex items-center gap-1 px-2 py-1 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition-colors"
                            >
                                {postType} <ChevronDown size={14} />
                            </button>
                            <div className="flex items-center gap-1 px-2 py-1 rounded-full border border-slate-200 bg-slate-100 text-slate-500 text-xs cursor-pointer hover:bg-slate-200 hover:text-slate-700 transition-colors">
                                <Globe size={12} /> Anyone
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Field (Optional but helpful for cards) */}
                <div className="px-6 border-b border-slate-100">
                    <input
                        type="text"
                        placeholder="Short summary (optional)"
                        className="w-full bg-transparent border-none focus:ring-0 text-sm py-2 text-slate-600 placeholder:text-slate-400 focus:outline-none"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                    />
                </div>

                {/* Main Text Input */}
                <div className="px-6">
                    <textarea
                        placeholder={postType === 'Problem' ? "What challenge are you facing? Describe the context..." : "Share your innovative idea or solution..."}
                        className="w-full min-h-[120px] bg-transparent border-none focus:ring-0 text-lg resize-y py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none"
                        value={text}
                        onChange={handleTextChange}
                    />
                </div>

                {/* --- DISPLAY TAGGED USERS --- */}
                {taggedUsers.length > 0 && (
                    <div className="px-6 pb-3 flex flex-wrap gap-2">
                        {taggedUsers.map(u => (
                            <span key={u.id} className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full text-sm border border-indigo-100">
                                <AtSign size={14} /> {u.name}
                                <button onClick={() => removeTaggedUser(u.id)} className="text-indigo-400 hover:text-indigo-600"><X size={14} /></button>
                            </span>
                        ))}
                    </div>
                )}

                {/* --- DYNAMIC CONTENT SECTIONS --- */}
                {/* 1. File/Media Attachments */}
                {attachments.length > 0 && (
                    <div className="px-6 pb-4 flex flex-col gap-4">
                        {attachments.map(att => (
                            <div key={att.id} className="relative group">
                                <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                    {att.type === 'image' && (
                                        <div className="relative w-full">
                                            <img src={att.preview} className="w-full max-h-[300px] object-contain rounded-lg bg-white border border-slate-200" alt="preview" />
                                        </div>
                                    )}
                                    {att.type === 'video' && (
                                        <div className="relative w-full">
                                            <video src={att.preview} controls className="w-full max-h-[300px] rounded-lg bg-white border border-slate-200" />
                                        </div>
                                    )}
                                    {att.type !== 'image' && att.type !== 'video' && (
                                        <>
                                            {att.type === 'doc' && <FileText size={24} className="text-indigo-600" />}
                                            {att.type === 'link' && <LinkIcon size={24} className="text-indigo-600" />}
                                            <span className="flex-1 text-sm text-slate-600 truncate">{att.name}</span>
                                        </>
                                    )}
                                    <button
                                        onClick={() => removeAttachment(att.id)}
                                        className={`
                                            ${(att.type === 'image' || att.type === 'video') ? 'absolute top-2 right-2 bg-black/60 text-white hover:bg-black/80' : 'text-red-500 hover:text-red-700 hover:bg-red-50'}
                                            rounded-full w-8 h-8 flex items-center justify-center transition-all p-1
                                        `}
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 2. Poll Creator */}
                {activeFeature === 'poll' && (
                    <div className="mx-6 mb-4 p-4 border border-amber-200 rounded-xl bg-amber-50">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="m-0 flex items-center gap-2 text-amber-600 font-semibold"><BarChart2 size={18} /> Create Poll</h4>
                            <button onClick={() => setActiveFeature(null)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
                        </div>
                        <input
                            className="input-field mb-3 font-semibold bg-white"
                            placeholder="Ask a question..."
                            value={pollQuestion}
                            onChange={(e) => setPollQuestion(e.target.value)}
                        />
                        <div className="space-y-2">
                            {pollOptions.map((opt, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input
                                        className="input-field py-2 bg-white"
                                        placeholder={`Option ${idx + 1}`}
                                        value={opt}
                                        onChange={(e) => updatePollOption(idx, e.target.value)}
                                    />
                                    {pollOptions.length > 2 && <button onClick={() => removePollOption(idx)} className="text-red-500 hover:text-red-700"><X size={16} /></button>}
                                </div>
                            ))}
                        </div>
                        <button onClick={addPollOption} disabled={pollOptions.length >= 5} className="mt-3 flex items-center gap-1 text-amber-600 hover:text-amber-700 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                            <Plus size={14} /> Add Option
                        </button>
                    </div>
                )}

                {/* 3. Link Input */}
                {activeFeature === 'link' && (
                    <div className="mx-6 mb-4 p-4 border border-cyan-200 rounded-xl bg-cyan-50">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="m-0 text-cyan-600 font-semibold">Add Link</h4>
                            <button onClick={() => setActiveFeature(null)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
                        </div>
                        <div className="flex gap-2">
                            <input
                                className="input-field bg-white"
                                placeholder="https://example.com"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                            />
                            <button className="btn-primary py-2 px-4" onClick={addLink}>Add</button>
                        </div>
                    </div>
                )}

                {/* 4. Tag User Input */}
                {activeFeature === 'tag' && (
                    <div className="mx-6 mb-4 p-4 border border-indigo-200 rounded-xl bg-indigo-50">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="m-0 flex items-center gap-2 text-indigo-600 font-semibold"><AtSign size={18} /> Tag People</h4>
                            <button onClick={() => setActiveFeature(null)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
                        </div>
                        <div className="relative">
                            <input
                                className="input-field bg-white"
                                placeholder="Search for users..."
                                value={tagQuery}
                                onChange={handleTagSearch}
                                autoFocus
                            />
                            {mockUserResults.length > 0 && (
                                <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 shadow-xl rounded-xl z-20 mt-1 max-h-48 overflow-y-auto">
                                    {mockUserResults.map(u => (
                                        <div key={u.id} onClick={() => addTaggedUser(u)} className="p-3 cursor-pointer border-b border-slate-100 flex items-center gap-3 hover:bg-slate-50 transition-colors last:border-0">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500"><User size={14} /></div>
                                            <div>
                                                <div className="font-semibold text-sm text-slate-900">{u.name}</div>
                                                <div className="text-xs text-slate-500">{u.role}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Toolbar */}
                <div className="p-4 flex justify-between items-center border-t border-slate-200 bg-slate-50">
                    <div className="flex gap-4 text-slate-400">
                        <div className="hover:text-indigo-600 transition-all hover:scale-110 cursor-pointer" onClick={() => triggerFileUpload('image')} title="Photo"><Image size={22} /></div>
                        <div className="hover:text-indigo-600 transition-all hover:scale-110 cursor-pointer" onClick={() => triggerFileUpload('video')} title="Video"><Video size={22} /></div>
                        <div className="hover:text-indigo-600 transition-all hover:scale-110 cursor-pointer" onClick={() => triggerFileUpload('doc')} title="Document"><FileText size={22} /></div>
                        <div className="w-px bg-slate-300 h-6"></div>
                        <div className={`transition-all hover:scale-110 cursor-pointer ${activeFeature === 'poll' ? 'text-amber-500' : 'hover:text-amber-500'}`} onClick={() => setActiveFeature('poll')} title="Poll"><BarChart2 size={22} /></div>
                        <div className={`transition-all hover:scale-110 cursor-pointer ${activeFeature === 'link' ? 'text-cyan-500' : 'hover:text-cyan-500'}`} onClick={() => setActiveFeature('link')} title="Link"><LinkIcon size={22} /></div>
                        <div className={`transition-all hover:scale-110 cursor-pointer ${activeFeature === 'tag' ? 'text-indigo-600' : 'hover:text-indigo-600'}`} onClick={() => setActiveFeature('tag')} title="Tag User"><AtSign size={22} /></div>
                    </div>
                    <button
                        className="btn-primary py-2 px-6 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={text.length === 0 || loading}
                        onClick={handlePost}
                    >
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        {loading ? 'Posting...' : 'Post'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PostPage;
