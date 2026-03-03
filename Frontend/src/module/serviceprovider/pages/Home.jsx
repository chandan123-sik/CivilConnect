import React, { useState } from 'react';

const ProviderHome = () => {
    const [isOnline, setIsOnline] = useState(true);

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24">
            {/* ── Top Header ── */}
            <div className="bg-white px-6 pt-14 pb-12 rounded-b-[40px] shadow-sm relative overflow-hidden">
                {/* Subtle Decorative Elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full -mr-10 -mt-10 opacity-50 block" />

                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white shadow-md">
                                <img src="https://ui-avatars.com/api/?name=Ramesh+Sharma&background=1E3A8A&color=fff" alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-0.5">Good Morning,</p>
                            <h1 className="text-slate-900 text-lg font-extrabold tracking-tight">Ramesh Sharma</h1>
                        </div>
                    </div>
                    <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </button>
                </div>

                {/* Status Toggle Card */}
                <div className="mt-8 bg-[#1E3A8A] rounded-3xl p-6 shadow-xl shadow-blue-900/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />

                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Service Availability</p>
                            <h2 className="text-white text-xl font-bold">{isOnline ? 'Online & Available' : 'Currently Offline'}</h2>
                        </div>
                        <button
                            onClick={() => setIsOnline(!isOnline)}
                            className={`relative inline-flex h-8 w-15 items-center rounded-full transition-all duration-300 focus:outline-none p-1 ${isOnline ? 'bg-blue-400' : 'bg-white/20'}`}
                        >
                            <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition duration-300 shadow-lg ${isOnline ? 'translate-x-7' : 'translate-x-0'}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Main Dashboard Body ── */}
            <div className="px-6 -mt-6">
                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-50 flex flex-col justify-between h-36">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Income</p>
                            <p className="text-xl font-black text-slate-900">₹24,500</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-50 flex flex-col justify-between h-36">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                        <div>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Leads</p>
                            <p className="text-xl font-black text-slate-900">12 Active</p>
                        </div>
                    </div>
                </div>

                {/* Section: New Requests */}
                <div className="mt-10">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-slate-900 font-[900] text-lg tracking-tight">New Requests</h3>
                        <button className="text-blue-600 font-bold text-xs hover:underline">View All</button>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white p-5 rounded-[30px] shadow-sm border border-slate-50 flex items-center justify-between group cursor-pointer hover:border-blue-100 transition-all active:scale-[0.98]">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-lg shadow-inner">
                                    🏠
                                </div>
                                <div>
                                    <h4 className="text-slate-900 font-bold text-[15px]">Amit Patel</h4>
                                    <p className="text-slate-400 text-xs font-medium">BHK Painting • Pune</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-slate-900 font-black text-[13px]">₹4,500</p>
                                <p className="text-blue-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Pending</p>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-[30px] shadow-sm border border-slate-50 flex items-center justify-between group cursor-pointer hover:border-blue-100 transition-all active:scale-[0.98]">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-lg shadow-inner">
                                    🏢
                                </div>
                                <div>
                                    <h4 className="text-slate-900 font-bold text-[15px]">Sneha Rao</h4>
                                    <p className="text-slate-400 text-xs font-medium">Kitchen Tiling • Mumbai</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-slate-900 font-black text-[13px]">₹12,000</p>
                                <p className="text-blue-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Pending</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section: Plan Status */}
                <div className="mt-10 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[32px] p-7 shadow-xl shadow-slate-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 ring-1 ring-white/10" />

                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">Current Subscription</p>
                            <h4 className="text-white text-lg font-bold">Annual Professional</h4>
                        </div>
                        <span className="bg-green-500/20 text-green-400 text-[10px] font-black px-3 py-1 rounded-full border border-green-500/30 tracking-widest uppercase">Active</span>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-[11px] font-bold">
                            <span className="text-slate-400 uppercase tracking-widest">Time Remaining</span>
                            <span className="text-white">245 Days</span>
                        </div>
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[67%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderHome;
