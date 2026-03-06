import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const AdminDashboard = () => {
    // Current state (dummy stats)
    const stats = [
        { label: 'Platform Users', value: '4.2K', sub: '+12% from last week', icon: '👤', color: 'bg-emerald-50 text-emerald-600' },
        { label: 'Revenue (MTD)', value: '₹5.42L', sub: 'Growing steadily', icon: '💰', color: 'bg-emerald-100 text-emerald-700' },
        { label: 'Pending Experts', value: '28', sub: 'Needs your review', icon: '⏳', color: 'bg-amber-50 text-amber-600' },
        { label: 'Live Service Leads', value: '145', sub: 'Active today', icon: '🚀', color: 'bg-blue-50 text-blue-600' },
    ];

    const recentActivities = [
        { id: 1, type: 'signup', user: 'Amit Patel', msg: 'Started a new Expert profile', time: '2 mins ago', icon: '👤' },
        { id: 2, type: 'payment', user: 'Rajesh Kumar', msg: 'Renewed Annual Elite Plan', time: '15 mins ago', icon: '💎' },
        { id: 3, type: 'lead', user: 'Sneha Rao', msg: 'Requested a Civil Engineer lead', time: '1h ago', icon: '⚡' },
        { id: 4, type: 'approval', user: 'Vikram Singh', msg: 'Expert verification approved', time: '3h ago', icon: '✅' },
    ];

    const [isNotificationOn, setIsNotificationOn] = useState(true);

    return (
        <div className="max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
            {/* ── Welcome Header ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-slate-900 text-4xl font-[1000] tracking-tighter mb-1">Welcome back, Chandan!</h1>
                    <p className="text-slate-500 text-sm font-medium">Your platform is performing <span className="text-emerald-600 font-bold">14.2% better</span> than last month.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsNotificationOn(!isNotificationOn)}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isNotificationOn ? 'bg-emerald-50 text-emerald-600 shadow-lg shadow-emerald-500/10' : 'bg-slate-100 text-slate-400'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    </button>
                    <div className="h-10 w-px bg-slate-200 mx-2" />
                    <div className="text-right">
                        <p className="text-slate-900 font-black text-sm uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-0.5">System Status: Online</p>
                    </div>
                </div>
            </div>

            {/* ── Top Level KPIs ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm group hover:border-emerald-200 transition-all hover:shadow-xl hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-14 h-14 rounded-2xl ${item.color.split(' ')[0]} flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform`}>
                                {item.icon}
                            </div>
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${item.color}`}>
                                Real-time
                            </span>
                        </div>
                        <h3 className="text-slate-400 text-[11px] font-black uppercase tracking-[0.25em] mb-1">{item.label}</h3>
                        <p className="text-slate-900 text-3xl font-[1000] tracking-tighter mb-1.5">{item.value}</p>
                        <p className="text-emerald-600 text-[11px] font-bold italic">{item.sub}</p>
                    </div>
                ))}
            </div>

            {/* ── Visual Insight & Activity Section ── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                {/* ── Practical Category Performance ── */}
                <div className="lg:col-span-3 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-slate-900 font-[1000] text-2xl tracking-tight leading-none mb-2">Service Performance</h2>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Highest activity services this week</p>
                        </div>
                        <NavLink to="/admin/dashboard/categories" className="px-4 py-2 bg-emerald-50 text-emerald-600 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm shadow-emerald-500/10">
                            Full Category Report
                        </NavLink>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        {[
                            { name: 'Home Painting', leads: 842, growth: '+12%', color: 'from-emerald-500 to-emerald-400' },
                            { name: 'Civil Engineering', leads: 654, growth: '+8%', color: 'from-blue-500 to-blue-400' },
                            { name: 'Electrical Works', leads: 432, growth: '+15%', color: 'from-indigo-500 to-indigo-400' },
                            { name: 'Interior Design', leads: 321, growth: '-2%', color: 'from-amber-500 to-amber-400' },
                        ].map((cat, idx) => (
                            <div key={idx} className="group/item">
                                <div className="flex justify-between items-center mb-2.5">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${cat.color}`} />
                                        <span className="text-slate-800 font-extrabold text-sm tracking-tight">{cat.name}</span>
                                    </div>
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${cat.growth.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                        {cat.growth}
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden p-0.5 border border-slate-100 shadow-inner">
                                    <div
                                        style={{ width: `${(cat.leads / 1000) * 100}%` }}
                                        className={`h-full bg-gradient-to-r ${cat.color} rounded-full transition-all duration-1000 shadow-sm`}
                                    />
                                </div>
                                <div className="flex justify-between mt-2 px-1">
                                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{cat.leads} Active Leads</span>
                                    <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Cap: 80%</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Background decoration - subtle */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-50 rounded-full opacity-20 blur-3xl" />
                </div>

                {/* Live Activity Feed */}
                <div className="lg:col-span-2 bg-[#0F172A] p-8 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col group">
                    <div className="absolute -top-20 -right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]" />

                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div>
                            <h2 className="text-white font-[1000] text-xl tracking-tight leading-none mb-1.5">Live Engagement</h2>
                            <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Happening right now</p>
                        </div>
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                    </div>

                    <div className="space-y-6 flex-1 relative z-10">
                        {recentActivities.map((act) => (
                            <div key={act.id} className="flex items-center gap-4 group/item cursor-pointer">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg shadow-inner group-hover/item:bg-emerald-500 group-hover/item:text-white transition-all">
                                    {act.icon}
                                </div>
                                <div className="flex-1 border-b border-white/5 pb-1 group-hover/item:border-emerald-500/20 transition-all">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <p className="text-white text-[13px] font-black tracking-tight">{act.user}</p>
                                        <span className="text-white/30 text-[9px] font-bold uppercase">{act.time}</span>
                                    </div>
                                    <p className="text-slate-400 text-[11px] font-medium opacity-80">{act.msg}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full py-4 mt-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] transition-all active:scale-95 shadow-lg shadow-emerald-500/20 relative z-10 outline-none">
                        Audit Global Feed
                    </button>
                </div>

            </div>

            {/* ── Quick Action Shortcuts ── */}
            <div className="mt-10 pt-10 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Review Approvals', path: '/admin/dashboard/approvals', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
                    { label: 'Monitor Leads', path: '/admin/dashboard/requests', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
                    { label: 'Manage Experts', path: '/admin/dashboard/providers', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                    { label: 'Audit Revenue', path: '/admin/dashboard/revenue', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                ].map((action, idx) => (
                    <NavLink
                        key={idx}
                        to={action.path}
                        className="flex flex-col items-center justify-center p-6 bg-white border border-slate-100 rounded-[32px] hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-inner">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={action.icon} /></svg>
                        </div>
                        <span className="text-slate-900 font-black text-[11px] uppercase tracking-widest group-hover:text-emerald-600 transition-colors">{action.label}</span>
                    </NavLink>
                ))}
            </div>

        </div>
    );
};

export default AdminDashboard;
