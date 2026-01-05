import React, { useState, useRef, useEffect } from 'react';
import {
    Search, Send, Paperclip, Phone, Video, MoreVertical,
    CheckCheck, Circle, Image, X, FileText, Trash2, Ban, Clock, AlertTriangle
} from 'lucide-react';

const Messages = () => {
    const [activeChatId, setActiveChatId] = useState(1);
    const [messageInput, setMessageInput] = useState('');
    const [attachments, setAttachments] = useState([]);
    const fileInputRef = useRef(null);

    // UI State for Menu
    const [showMenu, setShowMenu] = useState(false);

    // Per-Chat Settings State (Mocked)
    const [chatSettings, setChatSettings] = useState({
        1: { disappearing: false, duration: '24h', blocked: false },
        2: { disappearing: false, duration: '24h', blocked: false },
        3: { disappearing: true, duration: '1h', blocked: false }
    });

    // Mock Conversations List
    const [conversations, setConversations] = useState([
        {
            id: 1,
            name: 'Sarah Ventures Ltd.',
            role: 'Investor',
            avatarColor: 'bg-emerald-200',
            isOnline: true,
            lastMessage: 'Let\'s schedule a call for Tuesday?',
            time: '10:30 AM',
            unread: 2
        },
        {
            id: 2,
            name: 'David Chen',
            role: 'Collaborator',
            avatarColor: 'bg-blue-200',
            isOnline: false,
            lastMessage: 'I updated the prototype specs.',
            time: 'Yesterday',
            unread: 0
        },
        {
            id: 3,
            name: 'Dr. Emily Stone',
            role: 'User (Mentor)',
            avatarColor: 'bg-slate-200',
            isOnline: true,
            lastMessage: 'Great progress on the sensor data.',
            time: '2 days ago',
            unread: 0
        }
    ]);

    // Mock Messages Data
    const [messages, setMessages] = useState({
        1: [
            { id: 1, sender: 'them', text: 'Hi Thilak, I looked at your drone prototype.', time: '10:00 AM' },
            { id: 2, sender: 'them', text: 'The autonomous navigation logic is impressive.', time: '10:01 AM' },
            { id: 3, sender: 'me', text: 'Thank you, Sarah! We are currently optimizing the battery life.', time: '10:15 AM' },
            { id: 4, sender: 'them', text: 'Interesting. Do you have a pitch deck ready?', time: '10:28 AM' },
            { id: 5, sender: 'them', text: 'Let\'s schedule a call for Tuesday?', time: '10:30 AM' }
        ],
        2: [
            { id: 1, sender: 'them', text: 'Hey, did you see the new humidity sensor requirements?', time: 'Yesterday' },
            { id: 2, sender: 'me', text: 'Yes, checking them now.', time: 'Yesterday' },
            { id: 3, sender: 'them', text: 'I updated the prototype specs.', time: 'Yesterday' }
        ],
        3: [
            { id: 1, sender: 'me', text: 'Hello Dr. Stone, thanks for your feedback.', time: '2 days ago' }
        ]
    });

    const activeConversation = conversations.find(c => c.id === activeChatId);
    const activeMessages = messages[activeChatId] || [];
    const currentSettings = chatSettings[activeChatId] || { disappearing: false, duration: '24h', blocked: false };

    // --- File Handling Logic ---
    const triggerFileUpload = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const id = Date.now();
        const type = file.type.startsWith('image/') ? 'image' :
            file.type.startsWith('video/') ? 'video' : 'doc';

        const previewUrl = URL.createObjectURL(file);

        setAttachments([...attachments, {
            id, type, name: file.name, file: file, preview: previewUrl
        }]);

        e.target.value = '';
    };

    const removeAttachment = (id) => {
        setAttachments(attachments.filter(a => a.id !== id));
    };

    // --- Menu Actions ---
    const handleDeleteChat = () => {
        if (window.confirm("Delete this conversation? All messages will be permanently removed.")) {
            setMessages(prev => {
                const next = { ...prev };
                delete next[activeChatId];
                return next;
            });

            const updatedConv = conversations.filter(c => c.id !== activeChatId);
            setConversations(updatedConv);

            if (updatedConv.length > 0) {
                setActiveChatId(updatedConv[0].id);
            } else {
                setActiveChatId(null);
            }
            setShowMenu(false);
        }
    };

    const toggleBlockUser = () => {
        const isBlocked = !currentSettings.blocked;
        setChatSettings(prev => ({
            ...prev,
            [activeChatId]: { ...prev[activeChatId], blocked: isBlocked }
        }));

        // Add a system message about blocking
        const systemMsg = {
            id: Date.now(),
            sender: 'system',
            text: isBlocked ? 'You blocked this contact.' : 'You unblocked this contact.',
            time: 'Now'
        };
        setMessages(prev => ({
            ...prev,
            [activeChatId]: [...(prev[activeChatId] || []), systemMsg]
        }));

        setShowMenu(false);
    };

    const setDisappearingMode = (duration) => {
        setChatSettings(prev => ({
            ...prev,
            [activeChatId]: {
                ...prev[activeChatId],
                disappearing: duration !== 'off',
                duration: duration === 'off' ? prev[activeChatId]?.duration : duration
            }
        }));
        setShowMenu(false);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if ((!messageInput.trim() && attachments.length === 0) || currentSettings.blocked) return;

        const newMessage = {
            id: Date.now(),
            sender: 'me',
            text: messageInput,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            attachments: [...attachments],
            expiresAt: currentSettings.disappearing ? Date.now() + (parseDuration(currentSettings.duration)) : null
        };

        setMessages({
            ...messages,
            [activeChatId]: [...activeMessages, newMessage]
        });

        setMessageInput('');
        setAttachments([]);
    };

    const parseDuration = (d) => {
        if (d === '1h') return 3600000;
        if (d === '24h') return 86400000;
        if (d === '7d') return 604800000;
        return 0;
    };

    useEffect(() => {
        const handleClickOutside = () => setShowMenu(false);
        if (showMenu) document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showMenu]);


    if (!activeConversation) {
        return (
            <div className="container mx-auto px-4 py-8 text-center mt-12">
                <div className="glass-panel p-8">
                    <h3 className="text-xl font-bold text-white mb-2">No conversations selected</h3>
                    <p className="text-slate-400">Select a chat or start a new one.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 h-[calc(100vh-80px)]">
            <div className="glass-panel p-0 grid grid-cols-1 md:grid-cols-[320px_1fr] h-full overflow-hidden">

                {/* Hidden File Input */}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

                {/* Sidebar: Conversation List */}
                <div className="border-r border-slate-200 flex flex-col h-full bg-slate-50 hidden md:flex">

                    {/* Sidebar Header */}
                    <div className="p-4 border-b border-slate-200">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-bold text-slate-900">Messaging</h2>
                            <MoreVertical size={20} className="text-slate-400 cursor-pointer hover:text-slate-600" />
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search messages"
                                className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                        </div>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {conversations.map(conv => (
                            <div
                                key={conv.id}
                                onClick={() => setActiveChatId(conv.id)}
                                className={`
                                    p-4 flex gap-3 cursor-pointer transition-colors border-b border-slate-200
                                    ${activeChatId === conv.id ? 'bg-white border-l-4 border-l-indigo-500 shadow-sm' : 'hover:bg-slate-50 border-l-4 border-l-transparent'}
                                `}
                            >
                                <div className="relative flex-shrink-0">
                                    <div className={`w-12 h-12 rounded-full ${conv.avatarColor} shadow-inner`}></div>
                                    {conv.isOnline && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className={`text-sm truncate pr-2 ${conv.unread ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>{conv.name}</h4>
                                        <span className="text-xs text-slate-500 whitespace-nowrap">{conv.time}</span>
                                    </div>
                                    <div className={`text-sm truncate ${conv.unread ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}>
                                        {conv.lastMessage}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main: Chat Window */}
                <div className="flex flex-col h-full bg-slate-50 relative">

                    {/* Chat Header */}
                    <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white shadow-sm z-10">
                        <div className="flex items-center gap-3">
                            <div className="md:hidden w-10 h-10 rounded-full bg-slate-200 flex-shrink-0"></div> {/* Mobile Placeholder */}
                            <div className={`hidden md:block w-10 h-10 rounded-full ${activeConversation.avatarColor} shadow-inner`}></div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    {activeConversation.name}
                                    {currentSettings.blocked && <span className="text-[10px] text-red-400 border border-red-500/50 px-1 rounded uppercase">Blocked</span>}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400">{activeConversation.role}</span>
                                    {currentSettings.disappearing && (
                                        <span className="text-[10px] bg-cyan-900/30 text-cyan-400 px-1.5 py-0.5 rounded-full flex items-center gap-1 border border-cyan-500/20">
                                            <Clock size={10} /> Disappearing ON (24h)
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-slate-400">
                            {/* Dynamic Disappearing Button in Header */}
                            <button
                                onClick={() => setDisappearingMode(currentSettings.disappearing ? 'off' : '24h')}
                                className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${currentSettings.disappearing
                                    ? 'bg-cyan-50 border-cyan-200 text-cyan-600 font-bold animate-pulse'
                                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
                                    }`}
                                title="Toggle Disappearing Mode"
                            >
                                <Clock size={16} />
                                <span className="text-[10px] uppercase">{currentSettings.disappearing ? currentSettings.duration : 'Disappear'}</span>
                            </button>

                            <Video size={20} className="hover:text-indigo-600 cursor-pointer transition-colors" />
                            <Phone size={20} className="hover:text-indigo-600 cursor-pointer transition-colors" />

                            {/* More Menu Trigger (Three Dots) */}
                            <div onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} className="cursor-pointer hover:text-indigo-600 transition-colors relative">
                                <MoreVertical size={20} />

                                {/* Enhanced Dropdown Menu */}
                                {showMenu && (
                                    <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 w-64 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chat Governance</span>
                                            <MoreVertical size={12} className="text-slate-300" />
                                        </div>

                                        {/* Disappearing Options Nested/Static */}
                                        <div className="p-2 border-b border-slate-100">
                                            <div className="text-[10px] font-bold text-slate-500 px-2 py-1 mb-1">Disappearing Messages</div>
                                            <div className="grid grid-cols-2 gap-1 px-1">
                                                {['off', '1h', '24h', '7d'].map((dur) => (
                                                    <button
                                                        key={dur}
                                                        onClick={() => setDisappearingMode(dur)}
                                                        className={`px-2 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${(dur === 'off' && !currentSettings.disappearing) || (dur === currentSettings.duration && currentSettings.disappearing)
                                                            ? 'bg-indigo-600 text-white'
                                                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                                            }`}
                                                    >
                                                        {dur}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div onClick={toggleBlockUser} className="p-3 cursor-pointer flex items-center gap-3 text-slate-600 hover:bg-slate-50 transition-colors border-b border-slate-100">
                                            <Ban size={16} className={currentSettings.blocked ? 'text-emerald-500' : 'text-red-400'} />
                                            <span className="text-sm font-semibold">{currentSettings.blocked ? 'Unblock Contact' : 'Block Contact'}</span>
                                        </div>

                                        <div onClick={handleDeleteChat} className="p-3 cursor-pointer flex items-center gap-3 text-red-500 hover:bg-red-50 transition-colors">
                                            <Trash2 size={16} />
                                            <span className="text-sm font-semibold">Delete Conversation</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className={`flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-slate-50 scroll-smooth custom-scrollbar ${currentSettings.blocked ? 'grayscale-[0.5]' : ''}`}>

                        {/* System Message for Disappearing Mode */}
                        {currentSettings.disappearing && (
                            <div className="text-center mb-2">
                                <span className="text-[10px] font-black bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full border border-cyan-200 inline-flex items-center uppercase tracking-widest">
                                    <Clock size={10} className="mr-1.5" />
                                    Messages vanish in {currentSettings.duration}
                                </span>
                            </div>
                        )}

                        {activeMessages.map(msg => {
                            if (msg.sender === 'system') {
                                return (
                                    <div key={msg.id} className="flex justify-center my-2">
                                        <span className="text-[10px] font-bold bg-slate-200 text-slate-500 px-3 py-1 rounded-lg border border-slate-300 flex items-center gap-2 uppercase tracking-tight">
                                            {msg.text.includes('block') ? <Ban size={10} /> : <Info size={10} />}
                                            {msg.text}
                                        </span>
                                    </div>
                                );
                            }

                            const isMe = msg.sender === 'me';
                            return (
                                <div key={msg.id} className={`flex flex-col max-w-[80%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>

                                    {/* Bubble */}
                                    <div className={`
                                         p-3 sm:p-4 rounded-2xl shadow-sm relative text-sm
                                         ${isMe
                                            ? 'bg-indigo-600 text-white rounded-tr-sm'
                                            : 'bg-white text-slate-900 border border-slate-100 rounded-tl-sm shadow-md'}
                                    `}>
                                        {/* Display Attachments */}
                                        {msg.attachments && msg.attachments.length > 0 && (
                                            <div className="mb-2 space-y-2">
                                                {msg.attachments.map(att => (
                                                    <div key={att.id}>
                                                        {att.type === 'image' && (
                                                            <img src={att.preview} className="max-w-[200px] rounded-xl border border-white/20 shadow-lg" alt="sent attachment" />
                                                        )}
                                                        {att.type === 'video' && (
                                                            <video src={att.preview} controls className="max-w-[200px] rounded-xl border border-white/20 shadow-lg" />
                                                        )}
                                                        {att.type !== 'image' && att.type !== 'video' && (
                                                            <div className="flex items-center gap-2 bg-slate-100/10 p-2 rounded-xl border border-slate-200/20">
                                                                <FileText size={16} /> <span className="text-xs truncate max-w-[150px]">{att.name}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {msg.text && <p className="leading-relaxed font-medium whitespace-pre-wrap">{msg.text}</p>}
                                    </div>
                                    <div className="text-[9px] font-bold text-slate-400 mt-1 flex items-center gap-1 mx-2 uppercase tracking-tighter">
                                        {msg.time}
                                        {currentSettings.disappearing && <Clock size={8} className="text-cyan-500" />}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Input Area */}
                    <div className={`p-4 border-t border-slate-200 bg-white transition-all ${currentSettings.blocked ? 'bg-slate-50 opacity-100' : ''}`}>

                        {/* Blocked State Overlay */}
                        {currentSettings.blocked ? (
                            <div className="text-center p-4 bg-red-50 rounded-2xl border-2 border-dashed border-red-200 flex flex-col items-center gap-2">
                                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                                    <Ban size={20} />
                                </div>
                                <h4 className="text-sm font-bold text-red-600">Contact Blocked</h4>
                                <p className="text-[11px] text-red-500">Unblock {activeConversation.name} to resume this conversation.</p>
                                <button onClick={toggleBlockUser} className="mt-2 text-xs font-black text-indigo-600 hover:underline uppercase transition-all hover:text-indigo-800">Click to Unblock</button>
                            </div>
                        ) : (
                            <>
                                {/* Attachment Preview */}
                                {attachments.length > 0 && (
                                    <div className="flex gap-3 pb-3 overflow-x-auto">
                                        {attachments.map(att => (
                                            <div key={att.id} className="relative bg-slate-800 rounded-lg p-1 border border-slate-700 flex-shrink-0">
                                                {att.type === 'image' ? (
                                                    <img src={att.preview} className="h-14 rounded bg-black" alt="preview" />
                                                ) : att.type === 'video' ? (
                                                    <video src={att.preview} className="h-14 rounded bg-black" />
                                                ) : (
                                                    <div className="w-14 h-14 flex flex-col items-center justify-center text-[8px] text-slate-400">
                                                        <FileText size={20} className="mb-1" /> {att.name.slice(0, 5)}...
                                                    </div>
                                                )}
                                                <button onClick={() => removeAttachment(att.id)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <form onSubmit={handleSendMessage} className="flex gap-3 items-end">
                                    <button
                                        type="button"
                                        onClick={triggerFileUpload}
                                        className="p-3 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors border border-slate-200"
                                    >
                                        <Paperclip size={20} />
                                    </button>
                                    <div className="flex-1 relative">
                                        <textarea
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }}
                                            placeholder={currentSettings.disappearing ? "Disappearing message..." : "Write a message..."}
                                            rows="1"
                                            className={`
                                                w-full px-4 py-3 rounded-2xl bg-slate-50 border text-slate-900 placeholder:text-slate-400 resize-none min-h-[48px] focus:outline-none focus:ring-1 transition-all
                                                ${currentSettings.disappearing ? 'border-dashed border-cyan-800 focus:border-cyan-500 focus:ring-cyan-500/50' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/50'}
                                            `}
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!messageInput.trim() && attachments.length === 0}
                                        className="btn-primary w-12 h-12 p-0 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
                                    >
                                        <Send size={20} className="ml-0.5" />
                                    </button>
                                </form>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Messages;
