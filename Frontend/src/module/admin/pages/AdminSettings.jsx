import React, { useState, useEffect } from 'react';
import { getCMSSettings, updateCMSSettings, getFeedbacks, clearFeedbacks } from '../../../api/adminApi';

const AdminSettings = () => {
    const [formData, setFormData] = useState({
        username: 'Chandan',
        email: 'chandan@gmail.com',
        currentPassword: '',
        newPassword: '',
        role: 'SUPER_ADMIN'
    });

    const [isDisputeOpen, setIsDisputeOpen] = useState(false);

    // Initial Draft for CMS
    const [cmsDraft, setCmsDraft] = useState({
        policyPoints: [
            { id: 1, title: 'Data Collection', desc: 'CivilConnect collects information to facilitate connections between clients and civil engineering experts.' },
            { id: 2, title: 'Verified Experts', desc: 'All service providers undergo a verification process. We share your request details with selected experts.' },
            { id: 3, title: 'Secure Communication', desc: 'Your contact details are protected. Direct messaging is used only for project-related coordination.' },
            { id: 4, title: 'Payment Reference', desc: 'Pricing shown in materials and services are reference rates and subject to market fluctuations.' }
        ],
        ratingTitle: 'Enjoying CivilConnect?',
        ratingDesc: 'Your feedback helps us provide better experts.'
    });

    const [appRatings, setAppRatings] = useState([]);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [ratingFilter, setRatingFilter] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isDisputeOpen) {
            loadDisputeData();
        }
    }, [isDisputeOpen]);

    const loadDisputeData = async () => {
        try {
            const [cms, ratings] = await Promise.all([getCMSSettings(), getFeedbacks()]);
            if (cms) setCmsDraft(cms);
            setAppRatings(ratings);
        } catch (err) {
            console.error("Failed to load dispute center data:", err);
        }
    };

    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmitCMS = async () => {
        setIsSaving(true);
        try {
            await updateCMSSettings(cmsDraft);
            alert('Content successfully pushed to all panels! 🚀');
        } catch (err) {
            alert('Failed to update content');
        } finally {
            setIsSaving(false);
        }
    };

    const handleClearHistory = async () => {
        if (window.confirm('Clear all logs?')) {
            try {
                await clearFeedbacks();
                setAppRatings([]);
            } catch (err) {
                alert("Failed to clear history");
            }
        }
    };

    const filteredRatings = ratingFilter 
        ? appRatings.filter(r => r.stars === ratingFilter)
        : appRatings;

    // --- VIEW 1: DISPUTE CENTER ---
    if (isDisputeOpen) {
        return (
            <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-20 relative">
                {/* ── Feedback Side Drawer ── */}
                {isDrawerOpen && (
                    <div className="fixed inset-0 z-[100] flex justify-end">
                        {/* Backdrop */}
                        <div 
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                            onClick={() => setIsDrawerOpen(false)}
                        />
                        
                        {/* Drawer Content */}
                        <div className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-100 flex flex-col animate-in slide-in-from-right duration-500 ease-out">
                            {/* Header */}
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between shrink-0">
                                <div>
                                    <h2 className="text-2xl font-[1000] text-slate-900 tracking-tighter">Feedback Logs</h2>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total {appRatings.length} entries</p>
                                </div>
                                <button 
                                    onClick={() => setIsDrawerOpen(false)}
                                    className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all active:scale-95"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Filters Bar */}
                            <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-100 shrink-0">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block">Filter by Stars</label>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setRatingFilter(null)}
                                        className={`flex-1 py-2.5 rounded-xl text-[11px] font-[1000] uppercase tracking-tighter transition-all border ${!ratingFilter ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-500/20' : 'bg-white border-slate-200 text-slate-400 hover:border-green-300'}`}
                                    >
                                        All
                                    </button>
                                    {[1, 2, 3, 4, 5].map(num => (
                                        <button 
                                            key={num}
                                            onClick={() => setRatingFilter(num)}
                                            className={`w-12 py-2.5 rounded-xl text-[11px] font-[1000] transition-all border flex items-center justify-center gap-1 ${ratingFilter === num ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-white border-slate-200 text-slate-400 hover:border-amber-300'}`}
                                        >
                                            {num}★
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Logs List */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
                                {filteredRatings.length > 0 ? (
                                    filteredRatings.map((r, idx) => (
                                        <div 
                                            key={idx} 
                                            className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-green-100 transition-all group animate-in slide-in-from-bottom-4 duration-500"
                                            style={{ animationDelay: `${idx * 50}ms` }}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] ${r.role === 'User' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                                        {r.name.charAt(0)}
                                                    </div>
                                                    <span className="text-slate-900 font-black text-sm">{r.name}</span>
                                                </div>
                                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-md border uppercase tracking-wider ${r.role === 'User' ? 'bg-blue-50 text-blue-500 border-blue-100' : 'bg-green-50 text-green-500 border-green-100'}`}>
                                                    {r.role}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex text-amber-500 text-xs">
                                                    {'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}
                                                </div>
                                                <span className="text-slate-400 text-[10px] font-bold">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Today'}</span>
                                            </div>
                                            {r.comment && (
                                                <p className="mt-3 text-[12px] text-slate-500 font-medium leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100 italic">
                                                    "{r.comment}"
                                                </p>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center opacity-30">
                                        <div className="text-5xl mb-4">🔍</div>
                                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-center">No logs found for this filter</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-8 border-t border-slate-100 shrink-0">
                                <button
                                    onClick={handleClearHistory}
                                    className="w-full py-4 bg-red-50 text-red-500 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-sm"
                                >
                                    Destroy All Logs
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setIsDisputeOpen(false)}
                            className="bg-white text-green-700 w-12 h-12 rounded-2xl flex items-center justify-center border border-green-100 shadow-sm active:scale-95 transition-all text-2xl font-black"
                        >
                            ‹
                        </button>
                        <div>
                            <h1 className="text-green-800 text-3xl font-[1000] tracking-tighter m-0">Dispute Center</h1>
                            <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest mt-1">Live CMS & Feedback Tracker</p>
                        </div>
                    </div>
                    <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 border border-green-200">
                        <span className={`w-2 h-2 bg-green-500 rounded-full ${isSaving ? 'animate-ping' : 'animate-pulse'}`}></span>
                        {isSaving ? 'Syncing...' : 'System Ready'}
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-10">
                    {/* Privacy Policy Controller */}
                    <div className="col-span-8 space-y-8">
                        <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm">
                            <h3 className="text-slate-900 font-[1000] text-xl mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600 text-sm italic">P</span>
                                Privacy Policy Configuration
                            </h3>
                            <div className="space-y-8 mb-8">
                                {cmsDraft.policyPoints.map((point, idx) => (
                                    <div key={point.id} className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="bg-green-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">Point {idx + 1}</span>
                                            <input
                                                type="text"
                                                value={point.title}
                                                onChange={(e) => {
                                                    const newPoints = [...cmsDraft.policyPoints];
                                                    newPoints[idx].title = e.target.value;
                                                    setCmsDraft({ ...cmsDraft, policyPoints: newPoints });
                                                }}
                                                className="bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-extrabold text-green-700 outline-none focus:border-green-600 w-2/3 transition-all"
                                                placeholder="Enter title..."
                                            />
                                        </div>
                                        <textarea
                                            value={point.desc}
                                            onChange={(e) => {
                                                const newPoints = [...cmsDraft.policyPoints];
                                                newPoints[idx].desc = e.target.value;
                                                setCmsDraft({ ...cmsDraft, policyPoints: newPoints });
                                            }}
                                            className="w-full h-24 bg-white border-2 border-slate-200 rounded-xl p-4 text-[13px] font-bold text-slate-600 outline-none focus:border-green-600 resize-none transition-all leading-relaxed"
                                            placeholder="Enter detailed policy text..."
                                        />
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleSubmitCMS}
                                disabled={isSaving}
                                className="w-full py-5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl text-[12px] font-[1000] uppercase tracking-widest shadow-xl shadow-green-900/10 hover:shadow-green-900/20 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                <svg className={`w-5 h-5 ${isSaving ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                {isSaving ? 'Pumping Content...' : 'Submit Updated Content'}
                            </button>
                        </div>
                    </div>

                    {/* App Rating Tracker */}
                    <div className="col-span-4 space-y-8">
                        <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm h-fit">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-slate-900 font-[1000] text-xl">Feedback Tracker</h3>
                                <button
                                    onClick={() => setIsDrawerOpen(true)}
                                    className="text-green-600 font-black text-[10px] uppercase tracking-widest hover:underline active:scale-95 transition-all flex items-center gap-1"
                                >
                                    View All
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                </button>
                            </div>

                            <div className="space-y-4">
                                {appRatings.length > 0 ? (
                                    appRatings.slice(0, 3).map((r, idx) => (
                                        <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-2 transition-all hover:border-green-100 hover:shadow-md">
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-900 font-black text-[13px] tracking-tight">{r.name}</span>
                                                <span className={`text-[9px] font-[1000] uppercase px-2.5 py-1 rounded-full border ${r.role === 'User' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                                                    {r.role}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="text-amber-500 text-sm drop-shadow-sm">
                                                    {'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}
                                                </div>
                                                <span className="text-slate-400 text-[10px] font-black">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Just now'}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 opacity-30">
                                        <div className="text-4xl mb-2 text-green-500">📥</div>
                                        <p className="text-[10px] font-black uppercase tracking-widest">No ratings found</p>
                                    </div>
                                )}
                            </div>


                            <button
                                onClick={handleClearHistory}
                                className="w-full mt-6 py-3 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-colors opacity-40 hover:opacity-100"
                            >
                                Clear History
                            </button>
                        </div>

                        <div className="bg-green-900 rounded-[32px] p-8 text-white shadow-xl shadow-green-900/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 transition-transform group-hover:rotate-12">
                                <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M11 15h2v2h-2zm0-8h2v6h-2zm1-9C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>
                            </div>
                            <h4 className="font-black text-lg mb-4">Submission Alert</h4>
                            <p className="text-green-100/60 text-[12px] leading-relaxed font-bold">
                                Changes made to policy points remain in "Draft" state until you click the Submit button. Global sync triggers instantly after click.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- VIEW 2: STANDARD SETTINGS ---
    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-slate-900 text-3xl font-[1000] tracking-tighter mb-1">Settings</h1>
                    <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest">Master Admin Control Room</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-slate-700 font-bold text-[11px] uppercase tracking-widest shadow-sm hover:shadow-md hover:border-green-300 transition-all active:scale-95">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        Edit Profile
                    </button>
                    <div className="relative group">
                        <button className="flex items-center gap-2 bg-green-50 border border-green-200 px-5 py-2.5 rounded-xl text-green-700 font-bold text-[11px] uppercase tracking-widest shadow-sm hover:bg-green-100 transition-all active:scale-95">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            Manage Content
                        </button>
                        <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 p-2 transform origin-top-right group-hover:scale-100 scale-95">
                            <button
                                onClick={() => setIsDisputeOpen(true)}
                                className="w-full text-left px-4 py-3 hover:bg-green-50 rounded-xl text-green-800 text-[13px] font-black tracking-wide transition-all flex items-center gap-3 border-none bg-transparent cursor-pointer group"
                            >
                                <svg className="w-5 h-5 text-green-500 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                                Dispute Center
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[40px] p-12 shadow-sm border border-slate-100">
                <div className="mb-12">
                    <h2 className="text-slate-900 text-2xl font-[1000] tracking-tight mb-2">Admin Profile</h2>
                    <p className="text-slate-400 text-[13px] font-medium leading-relaxed max-w-lg">Modify your core account settings and authentication methods for the dashboard.</p>
                </div>

                <div className="grid grid-cols-2 gap-x-16 gap-y-12">
                    {/* Username Field */}
                    <div className="group">
                        <label className="text-slate-500 text-[11px] font-black uppercase tracking-[0.15em] block mb-3 px-1">Username</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none opacity-40">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                            <input
                                type="text" name="username" value={formData.username} disabled
                                className="w-full bg-slate-50 text-slate-400 font-bold text-[15px] rounded-2xl block pl-14 p-4.5 border border-slate-200 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="group">
                        <label className="text-slate-500 text-[11px] font-black uppercase tracking-[0.15em] block mb-3 px-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none opacity-40">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </div>
                            <input
                                type="email" name="email" value={formData.email} onChange={handleInput}
                                className="w-full bg-white border-2 border-slate-100 text-slate-900 font-extrabold text-[15px] rounded-2xl block pl-14 p-4.5 outline-none focus:border-green-500 focus:bg-green-50/10 transition-all"
                            />
                        </div>
                    </div>

                    {/* Password Fields */}
                    {['currentPassword', 'newPassword'].map((field) => (
                        <div className="group" key={field}>
                            <label className="text-slate-500 text-[11px] font-black uppercase tracking-[0.15em] block mb-3 px-1">{field === 'currentPassword' ? 'Current Password' : 'New Password'}</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none opacity-40">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                </div>
                                <input
                                    type="password" name={field} onChange={handleInput} placeholder="••••••••"
                                    className="w-full bg-white border-2 border-slate-100 text-slate-900 font-extrabold text-[15px] rounded-2xl block pl-14 p-4.5 outline-none focus:border-green-500 focus:bg-green-50/10 transition-all"
                                />
                            </div>
                        </div>
                    ))}

                    <div className="col-span-2 mt-8">
                        <button className="bg-green-700 hover:bg-green-800 text-white font-[1000] text-[13px] uppercase tracking-[0.2em] px-10 py-5 rounded-2xl shadow-xl shadow-green-900/20 active:scale-95 transition-all">
                            Save Account Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
