import React, { useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError('');
            setLoading(true);
            await login(emailRef.current.value, passwordRef.current.value);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Failed to log in: ' + err.message);
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
            <div className="glass-panel w-full max-w-md p-8 relative overflow-hidden shadow-xl">
                {/* Decorational background elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-200 rounded-full blur-[80px] opacity-40"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-200 rounded-full blur-[80px] opacity-40"></div>

                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-2 text-center text-slate-900">Welcome Back</h2>
                    <p className="text-slate-500 text-center mb-8">Login to continue your journey</p>

                    {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-4 text-sm">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                            <input
                                type="email"
                                ref={emailRef}
                                required
                                placeholder="Email Address"
                                className="input-field pl-10"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                            <input
                                type="password"
                                ref={passwordRef}
                                required
                                placeholder="Password"
                                className="input-field pl-10"
                            />
                        </div>

                        <button disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-4">
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <>Login <ArrowRight className="h-4 w-4" /></>}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-gray-400 text-sm">
                        Don't have an account? <Link to="/signup" className="text-primary hover:text-white transition-colors underline">Sign Up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
