import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Briefcase, Globe, MapPin, Check, Loader2, Award, Building } from 'lucide-react';

export default function Signup() {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Common
        fullName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'innovator', // 'innovator' or 'investor'
        country: '',
        city: '',

        // Innovator Specific
        bio: '',
        skills: '', // comma separated for now

        // Investor Specific
        investorType: 'individual',
        organizationName: '',
        website: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRoleSelect = (role) => {
        setFormData(prev => ({ ...prev, role }));
    };

    async function handleSubmit(e) {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        try {
            setError('');
            setLoading(true);

            // Structure the profile data
            const profileToSave = {
                fullName: formData.fullName,
                username: formData.username,
                role: formData.role,
                location: {
                    country: formData.country,
                    city: formData.city
                },
                visibility: {
                    public: true,
                    contact: 'request'
                }
            };

            if (formData.role === 'innovator') {
                profileToSave.details = {
                    bio: formData.bio,
                    skills: formData.skills.split(',').map(s => s.trim())
                };
            } else {
                profileToSave.details = {
                    type: formData.investorType,
                    organization: formData.organizationName,
                    website: formData.website
                };
            }

            await signup(formData.email, formData.password, profileToSave);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Failed to create account: ' + err.message);
        }
        setLoading(false);
    }

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
            <div className="glass-panel w-full max-w-2xl p-0 relative overflow-hidden flex flex-col md:flex-row min-h-[600px] shadow-xl">

                {/* Left Side - Graphic (Hidden on mobile) */}
                <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-indigo-600 to-purple-600 p-8 flex-col justify-between relative border-r border-slate-200">
                    <div className="relative z-10">
                        <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center mb-6 backdrop-blur-sm">
                            <Globe className="text-white" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4 text-white">Join InnoLink</h2>
                        <p className="text-indigo-100 text-sm">Where ideas verify, grow, and get funded.</p>
                    </div>

                    <div className="space-y-4 relative z-10">
                        <div className="flex items-center gap-3 text-sm text-indigo-100">
                            <div className="h-2 w-2 rounded-full bg-green-400"></div>
                            <span>Verify your startup ideas</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-indigo-100">
                            <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                            <span>Connect with investors</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-indigo-100">
                            <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                            <span>Build your team</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-7/12 p-8 flex flex-col">
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold">
                                {step === 1 && "Start your journey"}
                                {step === 2 && "Choose your path"}
                                {step === 3 && "Complete profile"}
                            </h3>
                            <div className="text-xs text-gray-500">Step {step} of 3</div>
                        </div>

                        {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-4 text-xs">{error}</div>}

                        <form onSubmit={(e) => { e.preventDefault(); if (step === 3) handleSubmit(e); else nextStep(); }}>

                            {/* STEP 1: Basic Info */}
                            {step === 1 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs text-slate-500">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                <input name="fullName" value={formData.fullName} onChange={handleChange} required className="input-field pl-9 py-2.5 text-sm font-semibold" placeholder="John Doe" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-slate-500">Username</label>
                                            <input name="username" value={formData.username} onChange={handleChange} required className="input-field py-2.5 text-sm" placeholder="@johnd" />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-500">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-field pl-9 py-2.5 text-sm" placeholder="john@example.com" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs text-slate-500">Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                <input type="password" name="password" value={formData.password} onChange={handleChange} required className="input-field pl-9 py-2.5 text-sm" placeholder="••••••••" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-slate-500">Confirm</label>
                                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="input-field py-2.5 text-sm" placeholder="••••••••" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: Role & Location */}
                            {step === 2 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div
                                            onClick={() => handleRoleSelect('innovator')}
                                            className={`cursor-pointer p-4 rounded-xl border transition-all ${formData.role === 'innovator' ? 'bg-indigo-50 border-indigo-500 shadow-sm' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                                        >
                                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                                                <Award className={`h-5 w-5 ${formData.role === 'innovator' ? 'text-indigo-600' : 'text-slate-400'}`} />
                                            </div>
                                            <h4 className="font-semibold text-sm mb-1 text-slate-900">Innovator</h4>
                                            <p className="text-xs text-slate-500">I want to post ideas, solve problems, and build.</p>
                                        </div>

                                        <div
                                            onClick={() => handleRoleSelect('investor')}
                                            className={`cursor-pointer p-4 rounded-xl border transition-all ${formData.role === 'investor' ? 'bg-purple-50 border-purple-500 shadow-sm' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                                        >
                                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                                                <Building className={`h-5 w-5 ${formData.role === 'investor' ? 'text-purple-600' : 'text-slate-400'}`} />
                                            </div>
                                            <h4 className="font-semibold text-sm mb-1 text-slate-900">Innovestor</h4>
                                            <p className="text-xs text-slate-500">I want to discover startups and invest capital.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-400">Country</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                                <input name="country" value={formData.country} onChange={handleChange} required className="input-field pl-9 py-2.5 text-sm" placeholder="USA" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-400">City</label>
                                            <input name="city" value={formData.city} onChange={handleChange} className="input-field py-2.5 text-sm" placeholder="San Francisco" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: Specifics */}
                            {step === 3 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    {formData.role === 'innovator' ? (
                                        <>
                                            <div className="space-y-1">
                                                <label className="text-xs text-gray-400">Short Bio</label>
                                                <textarea name="bio" value={formData.bio} onChange={handleChange} className="input-field text-sm h-24 resize-none" placeholder="Tell us about yourself..." />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs text-gray-400">Skills (comma separated)</label>
                                                <input name="skills" value={formData.skills} onChange={handleChange} className="input-field text-sm" placeholder="React, AI, Design, Marketing" />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="space-y-1">
                                                <label className="text-xs text-gray-400">Investor Type</label>
                                                <select name="investorType" value={formData.investorType} onChange={handleChange} className="input-field text-sm">
                                                    <option value="individual">Individual Angel</option>
                                                    <option value="startup">Startup</option>
                                                    <option value="vc">Venture Fund</option>
                                                    <option value="corporate">Corporate</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs text-gray-400">Organization Name</label>
                                                <input name="organizationName" value={formData.organizationName} onChange={handleChange} className="input-field text-sm" placeholder="Acme Ventures" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs text-gray-400">Website</label>
                                                <div className="relative">
                                                    <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                                    <input name="website" value={formData.website} onChange={handleChange} className="input-field pl-9 text-sm" placeholder="https://..." />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="mt-8 flex gap-3">
                                {step > 1 && (
                                    <button type="button" onClick={prevStep} className="btn-outline flex-1 py-2 text-sm">
                                        Back
                                    </button>
                                )}
                                <button type="submit" disabled={loading} className="btn-primary flex-1 py-2 text-sm flex items-center justify-center gap-2">
                                    {loading && <Loader2 className="animate-spin h-4 w-4" />}
                                    {step === 3 ? 'Create Account' : 'Next Step'}
                                </button>
                            </div>

                        </form>
                    </div>

                    <div className="mt-4 text-center text-xs text-gray-500">
                        Already have an account? <Link to="/login" className="text-primary hover:text-white transition-colors underline">Log in</Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
