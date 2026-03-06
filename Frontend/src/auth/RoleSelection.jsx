import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelection = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [category, setCategory] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleContinue = () => {
        if (!selectedRole) return;

        // Set the chosen role immediately
        localStorage.setItem('role', selectedRole);

        const isProfileComplete = localStorage.getItem('profile_complete') === 'true';
        const previousRole = localStorage.getItem('last_user_role'); // Track if role changed during test

        if (selectedRole === 'user') {
            // Update temporary token to role-specific one
            localStorage.setItem('access_token', 'dummy_user_token');

            if (isProfileComplete && previousRole === 'user') {
                navigate('/user/home');
            } else {
                // If switching from provider to user for testing, or brand new
                localStorage.setItem('last_user_role', 'user');
                navigate('/auth/complete-profile');
            }

        } else if (selectedRole === 'provider') {
            // Update temporary token to role-specific one
            localStorage.setItem('access_token', 'dummy_provider_token');

            if (isProfileComplete && previousRole === 'provider') {
                navigate('/serviceprovider/home');
            } else {
                if (!category.trim()) {
                    alert('Please enter your professional category');
                    return;
                }
                localStorage.setItem('provider_category', category.trim());
                localStorage.setItem('last_user_role', 'provider');
                navigate('/auth/create-professional-profile');
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-6">
            <style>{`
                @keyframes cardPop {
                    0% { transform: scale(0.9); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-card {
                    animation: cardPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
            `}</style>

            <div
                className={`w-full max-w-[340px] bg-white rounded-[32px] p-8 shadow-2xl transition-all duration-500 scale-90 opacity-0 ${isVisible ? 'animate-card' : ''}`}
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce">
                        👋
                    </div>
                    <h2 className="text-2xl font-[1000] text-slate-900 tracking-tight mb-2">Welcome!</h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed">
                        How would you like to use CivilConnect?
                    </p>
                </div>

                <div className="space-y-4">
                    {/* User Option */}
                    <button
                        onClick={() => setSelectedRole('user')}
                        className={`w-full group relative bg-white border-2 p-5 rounded-2xl transition-all duration-300 text-left active:scale-[0.97] ${selectedRole === 'user' ? 'border-[#7C3AED] shadow-lg shadow-purple-500/10' : 'border-slate-100 hover:border-[#7C3AED]'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-colors ${selectedRole === 'user' ? 'bg-[#7C3AED] text-white' : 'bg-purple-50 text-purple-500 group-hover:bg-[#7C3AED] group-hover:text-white'}`}>
                                🏠
                            </div>
                            <div>
                                <h3 className="text-slate-900 font-black text-sm uppercase tracking-wider mb-0.5">I am a User</h3>
                                <p className="text-slate-400 text-[10px] font-bold">I want to hire professionals</p>
                            </div>
                        </div>
                    </button>

                    {/* Service Provider Option */}
                    <button
                        onClick={() => setSelectedRole('provider')}
                        className={`w-full group relative bg-white border-2 p-5 rounded-2xl transition-all duration-300 text-left active:scale-[0.97] ${selectedRole === 'provider' ? 'border-[#1E3A8A] shadow-lg shadow-blue-500/10' : 'border-slate-100 hover:border-[#1E3A8A]'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-colors ${selectedRole === 'provider' ? 'bg-[#1E3A8A] text-white' : 'bg-blue-50 text-blue-500 group-hover:bg-[#1E3A8A] group-hover:text-white'}`}>
                                🛠️
                            </div>
                            <div>
                                <h3 className="text-slate-900 font-black text-sm uppercase tracking-wider mb-0.5">Service Provider</h3>
                                <p className="text-slate-400 text-[10px] font-bold">I want to offer my services</p>
                            </div>
                        </div>
                    </button>

                    {/* Category Selection for Provider */}
                    {selectedRole === 'provider' && (
                        <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] block mb-2 px-1">Choose Category</label>
                            <input
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="e.g. Contractor, Painter, Plumber"
                                className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-2xl p-4 text-xs font-bold text-slate-900 placeholder:text-slate-300 focus:border-[#1E3A8A] focus:bg-white outline-none transition-all"
                            />
                        </div>
                    )}
                </div>

                {selectedRole && (
                    <div className="mt-8">
                        <button
                            onClick={handleContinue}
                            className={`w-full py-5 rounded-[22px] text-xs font-[1000] uppercase tracking-[0.3em] text-white shadow-2xl transition-all active:scale-95 ${selectedRole === 'user' ? 'bg-[#7C3AED] shadow-purple-900/30' : 'bg-[#1E3A8A] shadow-blue-900/30'}`}
                        >
                            Continue
                        </button>
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                    <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">Select an option to proceed</p>
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;
