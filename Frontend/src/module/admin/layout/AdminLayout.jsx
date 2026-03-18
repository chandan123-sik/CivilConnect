import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Bell, Send } from 'lucide-react';
import axiosInstance from '../../../api/axiosInstance';

const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard/home', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z' },
    { label: 'Approval Management', path: '/admin/dashboard/approvals', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { label: 'User Options', path: '/admin/dashboard/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { label: 'Service Providers', path: '/admin/dashboard/providers', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { label: 'Category Options', path: '/admin/dashboard/categories', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { label: 'Request Monitor', path: '/admin/dashboard/requests', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { label: 'Subscription Plans', path: '/admin/dashboard/subscriptions', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
    { label: 'Revenue Dashboard', path: '/admin/dashboard/revenue', icon: 'M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z M2 17l10 5 10-5M2 12l10 5 10-5M12 2L2 7l10 5 10-5-10-5z' },
    { label: 'Reports', path: '/admin/dashboard/reports', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    { label: 'Materials Catalog', path: '/admin/dashboard/materials', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { label: 'Banner Management', path: '/admin/dashboard/banners', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { label: 'Settings', path: '/admin/dashboard/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
];

const AdminLayout = () => {
    const navigate = useNavigate();

    const [reports, setReports] = useState([]);
    const [showReports, setShowReports] = useState(false);
    const [replyTexts, setReplyTexts] = useState({});

    const fetchReports = async () => {
        try {
            const res = await axiosInstance.get('/admin/reports');
            if (res.data?.success) {
                setReports(res.data.data);
            }
        } catch (error) { console.error('Failed to fetch reports', error); }
    };

    useEffect(() => {
        fetchReports();
        const interval = setInterval(fetchReports, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleReply = async (reportId) => {
        if (!replyTexts[reportId]) return;
        try {
            await axiosInstance.patch(`/admin/reports/${reportId}/reply`, { reply: replyTexts[reportId] });
            setReplyTexts(prev => ({ ...prev, [reportId]: '' }));
            fetchReports();
        } catch (error) {
            alert('Failed to reply');
        }
    };

    const hasUnread = reports.some(r => r.status === 'Pending');

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
            {/* ── Left Sidebar (Dark Slate) ── */}
            <aside className="w-64 bg-[#0F172A] flex flex-col h-screen sticky top-0 border-r border-slate-800/50 shadow-2xl">
                {/* Branding */}
                <div className="p-6 pt-8 pb-8 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/20">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-white text-xl font-[1000] tracking-tight leading-none">CivilConnect</h1>
                        <p className="text-green-400 text-[10px] font-bold tracking-[0.2em] uppercase mt-1">Admin Panel</p>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar pb-6">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-300 font-medium text-[13px] group ${isActive
                                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/20 shadow-[inset_2px_0_0_rgba(255,255,255,0.2)]'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`
                            }
                        >
                            <svg className="w-5 h-5 shrink-0 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                {item.label === 'Settings' && <circle cx="12" cy="12" r="3" />}
                            </svg>
                            <span className="tracking-wide">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Logout Button (Bottom) */}
                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={() => {
                            localStorage.removeItem('cc_admin_token');
                            navigate('/admin/login');
                        }}
                        className="flex items-center gap-3.5 px-4 py-3.5 w-full text-left rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all font-medium text-[13px]"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Logout Session
                    </button>
                </div>
            </aside>

            {/* ── Main Content Area ── */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Unified Top Header across dashboard */}
                <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-end shrink-0 shadow-sm z-10 w-full relative">
                    <div className="flex items-center gap-6">

                        {/* Report Notifications Bell */}
                        <div className="relative">
                            <button
                                onClick={() => setShowReports(!showReports)}
                                className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all relative"
                            >
                                <Bell size={18} />
                                {hasUnread && (
                                    <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 ring-4 ring-slate-50" />
                                )}
                            </button>

                            {/* Reports Drawer */}
                            {showReports && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowReports(false)} />
                                    <div className="absolute top-[120%] right-0 w-[420px] max-h-[80vh] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col z-50 overflow-hidden" 
                                         style={{ animation: 'slideInRight 0.2s ease-out' }}>
                                        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                            <div>
                                                <h3 className="font-[1000] text-slate-900 text-base">User & Provider Reports</h3>
                                                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">System Monitoring</p>
                                            </div>
                                            <span className="bg-indigo-100 text-indigo-700 text-[10px] uppercase font-black px-2.5 py-1 rounded-lg tracking-wider">
                                                {reports.length} Total
                                            </span>
                                        </div>
                                        
                                        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
                                            {reports.length === 0 ? (
                                                <div className="text-center py-10 opacity-50">
                                                    <Bell className="mx-auto mb-3" size={32} />
                                                    <p className="text-sm font-bold text-slate-600">No reports found.</p>
                                                </div>
                                            ) : (
                                                reports.map(rep => (
                                                    <div key={rep._id} className={`p-4 rounded-2xl border ${rep.status === 'Pending' ? 'bg-red-50/30 border-red-100 shadow-sm' : 'bg-slate-50 border-slate-100'}`}>
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <h4 className="font-extrabold text-slate-900 text-sm">
                                                                    {rep.senderId?.fullName || rep.senderId?.businessName || 'Unknown User'}
                                                                </h4>
                                                                <p className="font-semibold text-slate-500 text-[11px]">
                                                                    {rep.senderModel} • {rep.senderId?.city}, {rep.senderId?.address}
                                                                </p>
                                                            </div>
                                                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg ${rep.status === 'Pending' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                                {rep.status}
                                                            </span>
                                                        </div>
                                                        <div className="bg-white p-3 rounded-xl border border-slate-100 text-slate-600 text-[13px] font-medium leading-relaxed mb-3">
                                                            {rep.message}
                                                        </div>

                                                        {rep.status === 'Pending' ? (
                                                            <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 ring-indigo-500/20 transition-all">
                                                                <input 
                                                                    type="text" 
                                                                    placeholder="Type your reply to resolve..."
                                                                    className="flex-1 bg-transparent border-none outline-none px-3 py-2.5 text-[13px] text-slate-700 font-medium placeholder:text-slate-400"
                                                                    value={replyTexts[rep._id] || ''}
                                                                    onChange={e => setReplyTexts(prev => ({ ...prev, [rep._id]: e.target.value }))}
                                                                    onKeyDown={e => e.key === 'Enter' && handleReply(rep._id)}
                                                                />
                                                                <button 
                                                                    onClick={() => handleReply(rep._id)}
                                                                    disabled={!replyTexts[rep._id]?.trim()}
                                                                    className={`px-3 flex items-center justify-center transition-all ${replyTexts[rep._id]?.trim() ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-300 pointer-events-none'}`}
                                                                >
                                                                    <Send size={16} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="mt-2 pl-3 border-l-2 border-green-400">
                                                                <p className="text-[10px] text-green-600 font-black tracking-widest uppercase mb-1">Admin Replied</p>
                                                                <p className="text-[13px] text-slate-800 font-bold">{rep.reply}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Admin Profile Chip */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-black text-sm shadow-md border-2 border-white ring-2 ring-slate-100">
                                CH
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-slate-900 font-[1000] text-sm leading-tight">Chandan</p>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Super Admin</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dynamic Page Content container */}
                <div className="flex-1 overflow-y-auto p-8 relative custom-scrollbar">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
