import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Lightbulb, Briefcase, PlusSquare, Search, User, Bell, MessageSquare, LogOut, Menu, X, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';

const Header = () => {
    const location = useLocation();
    const { currentUser, userProfile, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100';

    const NavLink = ({ to, icon: Icon, label }) => (
        <Link
            to={to}
            className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 ${isActive(to)}`}
            title={label}
        >
            <Icon size={22} className="mb-1" />
            <span className="text-[10px] font-medium uppercase tracking-wide">{label}</span>
        </Link>
    );

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo & Search */}
                <div className="flex items-center gap-6">
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logo} alt="InnoLink" className="h-8 w-auto object-contain" />
                    </Link>

                    {currentUser && (
                        <div className="relative hidden md:flex items-center">
                            <Search className="absolute left-3 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search ideas..."
                                className="pl-9 pr-4 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-sm text-slate-800 focus:outline-none focus:border-indigo-500 w-64 transition-all"
                            />
                        </div>
                    )}
                </div>

                {/* Desktop Navigation */}
                {currentUser ? (
                    <nav className="hidden md:flex items-center gap-1 h-full">
                        <NavLink to="/" icon={Home} label="Home" />
                        <NavLink to="/problems" icon={Briefcase} label="Problems" />
                        <NavLink to="/ideas" icon={Lightbulb} label="Ideas" />
                        <NavLink to="/post" icon={PlusSquare} label="Post" />
                        <NavLink to="/messages" icon={MessageSquare} label="Chat" />

                        <div className="w-px h-8 bg-slate-200 mx-2"></div>

                        <Link to="/notifications" className="relative p-2 text-slate-500 hover:text-slate-700 transition-colors">
                            <Bell size={22} />
                            <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </Link>

                        <div className="relative group ml-2">
                            <button className="flex items-center gap-2 outline-none">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white">
                                    {currentUser.email?.charAt(0).toUpperCase()}
                                </div>
                            </button>
                            {/* Dropdown */}
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                                <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:text-indigo-600 hover:bg-slate-50">
                                    <User size={16} /> Profile
                                </Link>
                                {userProfile?.role === 'Admin' && (
                                    <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:text-indigo-600 hover:bg-slate-50 border-t border-slate-100">
                                        <Shield size={16} /> Admin Panel
                                    </Link>
                                )}
                                <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 text-left">
                                    <LogOut size={16} /> Sign Out
                                </button>
                            </div>
                        </div>
                    </nav>
                ) : (
                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Log In</Link>
                        <Link to="/signup" className="btn-primary text-sm py-2 px-5 rounded-full">Sign Up</Link>
                    </div>
                )}

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-slate-500 hover:text-slate-900"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-4">
                    {currentUser ? (
                        <>
                            <div className="grid grid-cols-4 gap-2">
                                <NavLink to="/" icon={Home} label="Home" />
                                <NavLink to="/problems" icon={Briefcase} label="Jobs" />
                                <NavLink to="/ideas" icon={Lightbulb} label="Ideas" />
                                <NavLink to="/post" icon={PlusSquare} label="Post" />
                            </div>
                            <button onClick={logout} className="w-full flex items-center justify-center gap-2 p-3 text-red-400 bg-red-500/10 rounded-lg">
                                <LogOut size={18} /> Sign Out
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <Link to="/login" className="btn-outline text-center">Log In</Link>
                            <Link to="/signup" className="btn-primary text-center">Sign Up</Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;
