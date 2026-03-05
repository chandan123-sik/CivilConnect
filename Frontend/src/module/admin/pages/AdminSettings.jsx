import React, { useState } from 'react';

const AdminSettings = () => {
    const [formData, setFormData] = useState({
        username: 'Chandan',
        email: 'chandan@gmail.com',
        currentPassword: '',
        newPassword: '',
        role: 'SUPER_ADMIN'
    });

    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-slate-900 text-3xl font-[1000] tracking-tighter mb-1">Settings</h1>
                    <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest">Manage Admin Configuration</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-slate-700 font-bold text-[11px] uppercase tracking-widest shadow-sm hover:shadow-md transition-shadow active:scale-95">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        Edit Profile
                    </button>
                    <div className="relative group">
                        <button className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-5 py-2.5 rounded-xl text-slate-400 font-bold text-[11px] uppercase tracking-widest shadow-sm hover:text-slate-600 transition-colors active:scale-95">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            Manage Content
                        </button>

                        <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            <div className="p-2 flex flex-col gap-1">
                                <a href="/admin/dashboard/disputes" className="px-4 py-2.5 hover:bg-slate-50 rounded-lg text-slate-600 text-[13px] font-bold tracking-wide transition-colors flex items-center gap-3">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                                    Dispute Center
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 flex flex-col h-full min-h-[500px]">
                <div className="mb-10">
                    <h2 className="text-slate-900 text-xl font-black tracking-tight mb-2">Admin Profile</h2>
                    <p className="text-slate-400 text-[12px] font-medium leading-relaxed">Update your personal information and contact details.</p>
                </div>

                <div className="grid grid-cols-2 gap-x-12 gap-y-10 max-w-3xl">
                    {/* Username Field */}
                    <div className="group">
                        <label className="text-slate-500 text-[11px] font-black uppercase tracking-[0.1em] block mb-2 px-1 transition-colors group-hover:text-slate-900">Username</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-slate-400 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                            <input
                                type="text" name="username" value={formData.username} onChange={handleInput} disabled
                                className="w-full bg-slate-50 text-slate-400 font-bold text-sm rounded-xl block pl-14 p-4 outline-none opacity-70 cursor-not-allowed shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] border border-slate-200"
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="group">
                        <label className="text-slate-500 text-[11px] font-black uppercase tracking-[0.1em] block mb-2 px-1 transition-colors group-hover:text-slate-900">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-slate-400 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </div>
                            <input
                                type="email" name="email" value={formData.email} onChange={handleInput}
                                className="w-full bg-white border border-slate-200 placeholder:text-slate-300 text-slate-900 font-bold text-sm rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 block pl-14 p-4 outline-none hover:border-slate-300 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Current Password */}
                    <div className="group">
                        <label className="text-slate-500 text-[11px] font-black uppercase tracking-[0.1em] block mb-2 px-1 transition-colors group-hover:text-slate-900">Current Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-slate-400 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            </div>
                            <input
                                type="password" name="currentPassword" value={formData.currentPassword} onChange={handleInput} placeholder="Enter current password"
                                className="w-full bg-white border border-slate-200 placeholder:text-slate-300 text-slate-900 font-bold text-sm rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 block pl-14 p-4 outline-none hover:border-slate-300 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    {/* New Password */}
                    <div className="group">
                        <label className="text-slate-500 text-[11px] font-black uppercase tracking-[0.1em] block mb-2 px-1 transition-colors group-hover:text-slate-900">New Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-slate-400 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            </div>
                            <input
                                type="password" name="newPassword" value={formData.newPassword} onChange={handleInput} placeholder="Enter new password"
                                className="w-full bg-white border border-slate-200 placeholder:text-slate-300 text-slate-900 font-bold text-sm rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 block pl-14 p-4 outline-none hover:border-slate-300 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Role Status */}
                    <div className="col-span-1 border-t border-slate-100 pt-8 mt-2 group">
                        <label className="text-slate-500 text-[11px] font-black uppercase tracking-[0.1em] block mb-2 px-1 transition-colors group-hover:text-slate-900">System Role</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-slate-400 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            </div>
                            <input
                                type="text" name="role" value={formData.role} disabled
                                className="w-full bg-slate-50 text-slate-400 font-bold text-sm rounded-xl block pl-14 p-4 outline-none opacity-70 cursor-not-allowed shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] border border-slate-200"
                            />
                        </div>
                    </div>
                </div>

                {/* Save Block */}
                <div className="mt-14 max-w-[280px]">
                    <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-[1000] text-[13px] uppercase tracking-widest py-4 rounded-2xl shadow-lg shadow-green-500/20 active:scale-[0.98] transition-all focus:outline-none flex items-center justify-center gap-3 group">
                        <svg className="w-5 h-5 text-white/80 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                        Save Profile Config
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
