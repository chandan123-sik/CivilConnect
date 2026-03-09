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

    // Dynamic Logic: Load real leads from localStorage to make the dashboard ALIVE
    const [realLeads] = React.useState(() => JSON.parse(localStorage.getItem('cc_leads') || '[]'));

    const [showNotifications, setShowNotifications] = useState(false);
    const [showAuditLog, setShowAuditLog] = useState(false);
    const [hiddenNotifIds, setHiddenNotifIds] = useState([]);

    // Dynamic Notifications based on real activity
    const notifications = React.useMemo(() => {
        const baseNotifications = [
            { id: 'b1', title: 'Platform Health', desc: 'System status is optimal.', time: 'Now', priority: 'low' },
            { id: 'b2', title: 'New Provider Signup', desc: 'Suresh Carpentry is waiting for verification.', time: '2m ago', priority: 'high' },
            { id: 'b3', title: 'Payment Successful', desc: 'Rajesh Kumar paid ₹2,500 for Elite Plan.', time: '15m ago', priority: 'medium' },
            { id: 'b4', title: 'Lead Response Delay', desc: '3 leads in Mumbai have no responses.', time: '1h ago', priority: 'low' },
            { id: 'b5', title: 'Database Backup', desc: 'Daily backup completed successfully.', time: '3h ago', priority: 'low' },
            { id: 'b6', title: 'Dispute Resolved', desc: 'Payment dispute #4022 resolved.', time: '5h ago', priority: 'medium' },
        ];
        // Add new leads to notifications
        const leadNotifications = realLeads.slice(0, 3).map(lead => ({
            id: `lead-${lead.id}`,
            title: 'New Service Lead',
            desc: `${lead.client} requested ${(lead.service || '').slice(0, 20)}...`,
            time: lead.date,
            priority: 'high'
        }));
        return [...leadNotifications, ...baseNotifications].filter(n => !hiddenNotifIds.includes(n.id));
    }, [realLeads, hiddenNotifIds]);

    const handleClearAllNotifs = () => {
        setHiddenNotifIds(prev => [...prev, ...notifications.map(n => n.id)]);
    };

    // State for Audit Global Feed items
    const [auditFeed, setAuditFeed] = useState(() => 
        [...Array(12)].map((_, i) => ({
            id: `audit-${1082 - i}`,
            eventNum: 1082 - i,
            time: `${Math.floor(i * 5.2)} mins ago`,
            title: ['User Signup', 'Lead Created', 'Subscription Paid', 'Expert Approved', 'Dispute Opened', 'Profile Updated'][i % 6],
            desc: 'Dynamic activity logged by the system regarding platform growth and user engagement metrics.'
        }))
    );

    const handleRemoveAuditItem = (id) => {
        setAuditFeed(prev => prev.filter(item => item.id !== id));
    };

    // Dynamic Activities Feed
    const recentActivities = React.useMemo(() => {
        const leadActivities = realLeads.slice(0, 2).map(lead => ({
            id: lead.id,
            type: 'lead',
            user: lead.client,
            msg: `Requested: ${lead.service}`,
            time: lead.date,
            icon: '🚀'
        }));

        const baseActivities = [
            { id: 99, type: 'signup', user: 'Amit Patel', msg: 'Started a new Expert profile', time: '2 mins ago', icon: '👤' },
            { id: 100, type: 'payment', user: 'Rajesh Kumar', msg: 'Renewed Annual Elite Plan', time: '15 mins ago', icon: '💎' },
        ];
        return [...leadActivities, ...baseActivities];
    }, [realLeads]);

    return (
        <div className="max-w-7xl mx-auto pb-10 animate-in fade-in duration-500 relative">
            {/* ── Welcome Header ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-slate-900 text-4xl font-[1000] tracking-tighter mb-1">Welcome back, Chandan!</h1>
                    <p className="text-slate-500 text-sm font-medium">Your platform is performing <span className="text-emerald-600 font-bold">14.2% better</span> than last month.</p>
                </div>
                <div className="flex items-center gap-3 relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all relative ${showNotifications ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 rotate-12' : 'bg-white border border-slate-200 text-slate-400 hover:border-emerald-300'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        {notifications.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-bounce" />
                        )}
                    </button>

                    {/* Premium Notification Center */}
                    {showNotifications && (
                        <div className="absolute top-16 right-0 w-[280px] bg-white rounded-[24px] shadow-2xl border border-slate-100 p-5 z-[500] animate-in zoom-in-95 slide-in-from-top-4 duration-300">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-slate-900 font-black text-xs uppercase tracking-widest">Notifications</h4>
                                <button onClick={handleClearAllNotifs} className="text-[9px] font-bold text-emerald-600 uppercase hover:underline">Clear All</button>
                            </div>
                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {notifications.map(n => (
                                    <div key={n.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-emerald-200 transition-colors cursor-pointer group">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-[11px] font-black text-slate-800 group-hover:text-emerald-700">{n.title}</p>
                                            <span className="text-[8px] text-slate-400 font-bold">{n.time}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{n.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

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

                    <button
                        onClick={() => setShowAuditLog(true)}
                        className="w-full py-4 mt-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] transition-all active:scale-95 shadow-lg shadow-emerald-500/20 relative z-10 outline-none"
                    >
                        Audit Global Feed
                    </button>
                </div>

            </div>

            {/* ── Global Audit Feed Drawer ── */}
            {showAuditLog && (
                <div className="fixed inset-0 z-[1000] flex justify-end animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAuditLog(false)} />
                    <div className="relative w-full max-w-md bg-[#0F172A] shadow-2xl p-8 overflow-y-auto animate-in slide-in-from-right duration-500 ease-out">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-white font-[1000] text-2xl tracking-tight">Audit Global Feed</h3>
                                <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Full Activity Perspective</p>
                            </div>
                            <button onClick={() => setShowAuditLog(false)} className="w-10 h-10 rounded-xl bg-white/5 text-white flex items-center justify-center hover:bg-white/10 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {auditFeed.length > 0 ? auditFeed.map((item) => (
                                <div key={item.id} className="relative p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all group cursor-default">
                                    <button 
                                        onClick={() => handleRemoveAuditItem(item.id)}
                                        className="absolute top-4 right-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Dismiss Activity"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                    <div className="flex justify-between items-center mb-2 pr-6">
                                        <span className="text-emerald-400 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-emerald-500/10 rounded-lg">Event #{item.eventNum}</span>
                                        <span className="text-slate-500 text-[10px] font-bold uppercase">{item.time}</span>
                                    </div>
                                    <p className="text-white font-black text-sm tracking-tight mb-1">{item.title}</p>
                                    <p className="text-slate-400 text-[11px] leading-relaxed pr-6">{item.desc}</p>
                                </div>
                            )) : (
                                <div className="text-center py-10 opacity-50">
                                    <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-2">Feed Cleared</p>
                                    <p className="text-slate-400 text-xs">No recent global activities to display.</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-10 p-6 rounded-[24px] bg-gradient-to-br from-emerald-600/20 to-transparent border border-emerald-500/20">
                            <p className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-2">System Insight</p>
                            <p className="text-slate-400 text-[11px] leading-relaxed italic">"Global feed items are archived every 24 hours to maintain system performance. Detailed logs can be exported from the Revenue section."</p>
                        </div>
                    </div>
                </div>
            )}

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
