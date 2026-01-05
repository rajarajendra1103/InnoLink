import React, { useState, useEffect } from 'react';
import {
    Bell, Tag, BarChart2, AlertTriangle, CheckCircle, AtSign, Briefcase
} from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const Notifications = () => {
    const { currentUser } = useAuth();
    const [filter, setFilter] = useState('All'); // All, Unread
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, 'notifications'),
            where('userId', '==', currentUser.uid),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notifs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                Icon: getIcon(doc.data().type),
                colorClass: getColorClass(doc.data().type)
            }));
            setNotifications(notifs);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const getIcon = (type) => {
        switch (type) {
            case 'tag_problem': return Tag;
            case 'poll_update': return BarChart2;
            case 'admin_action': return AlertTriangle;
            case 'mention': return AtSign;
            case 'investment': return Briefcase;
            default: return Bell;
        }
    };

    const getColorClass = (type) => {
        switch (type) {
            case 'tag_problem': return 'bg-blue-500';
            case 'poll_update': return 'bg-indigo-500';
            case 'admin_action': return 'bg-amber-500';
            case 'mention': return 'bg-emerald-500';
            case 'investment': return 'bg-pink-500';
            default: return 'bg-slate-500';
        }
    };

    const toggleRead = async (item) => {
        if (item.read) return;
        const notifRef = doc(db, 'notifications', item.id);
        await updateDoc(notifRef, { read: true });
    };

    const markAllRead = async () => {
        const batch = writeBatch(db);
        notifications.filter(n => !n.read).forEach(n => {
            batch.update(doc(db, 'notifications', n.id), { read: true });
        });
        await batch.commit();
    };

    const filteredNotifications = filter === 'All'
        ? notifications
        : notifications.filter(n => !n.read);

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">

            <div className="glass-panel p-0 overflow-hidden min-h-[80vh]">

                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Bell size={24} className="text-indigo-600" /> Notifications
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('All')}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === 'All' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('Unread')}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === 'Unread' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
                        >
                            Unread
                        </button>
                        <button
                            onClick={markAllRead}
                            className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold ml-2"
                        >
                            Mark all read
                        </button>
                    </div>
                </div>

                {/* List */}
                <div>
                    {filteredNotifications.length === 0 ? (
                        <div className="p-10 text-center text-slate-500">
                            <CheckCircle size={48} className="mx-auto mb-4 opacity-50" />
                            <p>You're all caught up!</p>
                        </div>
                    ) : (
                        filteredNotifications.map(item => (
                            <div
                                key={item.id}
                                onClick={() => toggleRead(item)}
                                className={`
                                     flex gap-4 p-4 sm:p-6 cursor-pointer border-b border-slate-100 transition-colors
                                     ${item.read ? 'bg-transparent hover:bg-slate-50' : 'bg-slate-50 hover:bg-slate-100'}
                                 `}
                            >
                                {/* Icon Box */}
                                <div className={`w-10 h-10 rounded-full ${item.colorClass} flex items-center justify-center flex-shrink-0 text-white shadow-md shadow-slate-200`}>
                                    <item.Icon size={20} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-sm sm:text-base font-semibold ${item.read ? 'text-slate-600' : 'text-slate-900'}`}>{item.title}</span>
                                        <span className="text-xs text-slate-400 whitespace-nowrap ml-2">{item.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}</span>
                                    </div>
                                    <p className={`text-sm leading-relaxed ${item.read ? 'text-slate-500' : 'text-slate-700'}`}>
                                        {item.message}
                                    </p>
                                </div>

                                {/* Unread Dot */}
                                {!item.read && (
                                    <div className="self-center">
                                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

            </div>

        </div>
    );
};

export default Notifications;
