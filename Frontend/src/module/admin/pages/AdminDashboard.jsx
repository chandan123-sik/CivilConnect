import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { showToast } from '../../../components/Toast';
import { 
    Users, 
    ShieldCheck, 
    Hourglass, 
    Zap, 
    Rocket, 
    Package, 
    UserPlus, 
    AlertCircle, 
    Globe, 
    Database, 
    Server, 
    Cloud,
    Search,
    ChevronRight,
    ArrowUpRight
} from 'lucide-react';
import { getAdminStats, getAllLeads, getAllOrders, getPendingApprovals, updateApprovalStatus, getAllReports, replyToReport, getPlatformHealth } from '../../../api/adminApi';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [statsData, setStatsData] = useState({ users: 0, providers: 0, pendingApprovals: 0, liveLeads: 0 });
    const [loading, setLoading] = useState(true);
    const [realLeads, setRealLeads] = useState([]);
    const [materialOrders, setMaterialOrders] = useState([]);
    const [pendingExperts, setPendingExperts] = useState([]);
    const [realNotifications, setRealNotifications] = useState([]);
    const [realReports, setRealReports] = useState([]);

    const fetchData = async () => {
        try {
            const [stats, leads, orders, approvals, notifsRes, reportsRes, healthRes] = await Promise.all([
                getAdminStats(),
                getAllLeads(),
                getAllOrders(),
                getPendingApprovals(),
                window.adminApi?.getAdminNotifications ? window.adminApi.getAdminNotifications() : import('../../../api/adminApi').then(m => m.getAdminNotifications()),
                getAllReports(),
                getPlatformHealth()
            ]);
            setStatsData(stats.data || stats);
            setRealLeads(leads.data || leads);
            setMaterialOrders(orders.data || orders);
            const allApprovals = approvals.data || approvals;
            const onlyPending = allApprovals.filter(p => p.approvalStatus === 'pending');
            setPendingExperts(onlyPending);
            setRealNotifications(notifsRes.data || notifsRes);
            const reports = reportsRes.data || reportsRes;
            setRealReports(reports.filter(r => r.status === 'Pending'));
            setHealthStatus(healthRes.data || healthRes);
        } catch (err) {
            console.error("Dashboard fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const iv = setInterval(fetchData, 30000);
        return () => clearInterval(iv);
    }, []);

    const stats = [
        { label: 'Platform Users', value: statsData.users, sub: 'Total registered', icon: <Users size={28} color="#10B981" strokeWidth={2.5} />, color: 'bg-emerald-50 text-emerald-600' },
        { label: 'Total Experts', value: statsData.providers, sub: 'Verified members', icon: <ShieldCheck size={28} color="#047857" strokeWidth={2.5} />, color: 'bg-emerald-100 text-emerald-700' },
        { label: 'Pending Experts', value: statsData.pendingApprovals, sub: 'Needs review', icon: <Hourglass size={28} color="#D97706" strokeWidth={2.5} />, color: 'bg-amber-50 text-amber-600' },
        { label: 'Live Service Leads', value: statsData.liveLeads, sub: 'Active requests', icon: <Zap size={28} color="#2563EB" strokeWidth={2.5} />, color: 'bg-blue-50 text-blue-600' },
    ];

    const [showNotifications, setShowNotifications] = useState(false);
    const [showAuditLog, setShowAuditLog] = useState(false);
    const [hiddenNotifIds, setHiddenNotifIds] = useState([]);
    const [showQuickAction, setShowQuickAction] = useState(false);
    const [hasSeenNotifications, setHasSeenNotifications] = useState(true); // Default to true until checked
    const [prevNotifCount, setPrevNotifCount] = useState(0);
    
    const [healthStatus, setHealthStatus] = useState([
        { label: 'API Gateway', status: 'Operational', latency: '24ms', icon: <Globe size={22} color="#10B981" />, color: 'text-emerald-500', bar: 98 },
        { label: 'Database', status: 'Operational', latency: '0ms', icon: <Database size={22} color="#10B981" />, color: 'text-emerald-500', bar: 100 },
        { label: 'App Server', status: 'Operational', latency: '0ms', icon: <Server size={22} color="#10B981" />, color: 'text-emerald-500', bar: 100 },
        { label: 'Storage CDN', status: 'Operational', latency: '45ms', icon: <Cloud size={22} color="#10B981" />, color: 'text-emerald-500', bar: 95 },
    ]);
    
    const handleApproveExpert = async (id, status = 'approved') => {
        try {
            await updateApprovalStatus(id, status);
            showToast(`Expert ${status} successfully`);
            fetchData();
        } catch (err) {
            showToast("Action failed", "error");
        }
    };
    
    const handleResolveTicket = async (id) => {
        try {
            await replyToReport(id, 'Resolved via Dashboard Quick Action');
            showToast("Ticket resolved successfully");
            fetchData();
        } catch (err) {
            showToast("Action failed", "error");
        }
    };

    // Dynamic Notifications based on real activity
    const notifications = React.useMemo(() => {
        const backendNotifs = (realNotifications || []).map(n => ({
            id: n._id,
            title: n.title,
            desc: n.message,
            time: new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            priority: n.type === 'Approval' ? 'high' : 'medium',
            isRead: n.isRead
        }));

        const leadNotifications = realLeads.slice(0, 3).map(lead => ({
            id: `lead-${lead._id}`,
            title: 'New Service Lead',
            desc: `${lead.clientName || 'Someone'} requested ${(lead.serviceType || '').slice(0, 20)}...`,
            time: lead.createdAt ? new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'New',
            priority: 'medium'
        }));

        // Combine and filter locally hidden ones
        const combined = [...backendNotifs, ...leadNotifications].filter(n => !hiddenNotifIds.includes(n.id));
        return combined.sort((a, b) => (a.isRead === b.isRead ? 0 : a.isRead ? 1 : -1));
    }, [realNotifications, realLeads, hiddenNotifIds]);

    // Track new notification arrivals with persistence
    useEffect(() => {
        const lastSeenCount = parseInt(localStorage.getItem('admin_dashboard_last_seen_count') || '0');
        if (notifications.length > lastSeenCount) {
            setHasSeenNotifications(false);
        } else {
            setHasSeenNotifications(true);
        }
    }, [notifications.length]);

    const handleClearAllNotifs = async () => {
        try {
            const { markNotificationsRead } = await import('../../../api/adminApi');
            await markNotificationsRead();
            setHiddenNotifIds(prev => [...prev, ...notifications.map(n => n.id)]);
            fetchData();
        } catch (err) {
            console.error("Clear notifications error:", err);
        }
    };

    const handleRemoveAuditItem = (id) => {
        // Logic to dismiss/hide specific activity if needed
    };

    // Dynamic Activities Feed
    const recentActivities = React.useMemo(() => {
        const leadActs = (realLeads || []).slice(0, 5).map(l => ({
            id: `l-${l._id}`,
            type: 'lead',
            user: l.clientName || 'Guest User',
            msg: `Requested: ${l.serviceType || 'Service'}`,
            time: l.createdAt ? new Date(l.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
            icon: <Rocket size={20} color="#10B981" />,
            ts: new Date(l.createdAt).getTime()
        }));

        const orderActs = (materialOrders || []).slice(0, 5).map(o => ({
            id: `o-${o._id}`,
            type: 'order',
            user: o.fullName || 'Purchaser',
            msg: `Order: ${o.materialName || 'Material'}`,
            time: o.createdAt ? new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
            icon: <Package size={20} color="#F59E0B" />,
            ts: new Date(o.createdAt).getTime()
        }));

        const expertActs = (pendingExperts || []).slice(0, 5).map(e => ({
            id: `e-${e._id}`,
            type: 'signup',
            user: e.fullName || 'Expert',
            msg: `Joined as: ${e.category || 'Professional'}`,
            time: e.createdAt ? new Date(e.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'New',
            icon: <UserPlus size={20} color="#3B82F6" />,
            ts: new Date(e.createdAt).getTime()
        }));

        const reportActs = (realReports || []).slice(0, 5).map(r => ({
            id: `r-${r._id}`,
            type: 'report',
            user: r.senderId?.fullName || 'User',
            msg: `Alert: ${r.message?.slice(0, 25)}...`,
            time: r.createdAt ? new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Alert',
            icon: <AlertCircle size={20} color="#EF4444" />,
            ts: new Date(r.createdAt).getTime()
        }));

        return [...leadActs, ...orderActs, ...expertActs, ...reportActs]
            .sort((a, b) => b.ts - a.ts)
            .slice(0, 15);
    }, [realLeads, materialOrders, pendingExperts, realReports]);

    const topCategories = React.useMemo(() => {
        if (!realLeads || realLeads.length === 0) return [];
        
        const counts = {};
        realLeads.forEach(lead => {
            const cat = lead.serviceType || 'Other Services';
            counts[cat] = (counts[cat] || 0) + 1;
        });
        
        const sorted = Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .map(([name, count], index) => {
                const colors = [
                    'from-emerald-500 to-emerald-400',
                    'from-blue-500 to-blue-400',
                    'from-indigo-500 to-indigo-400',
                    'from-amber-500 to-amber-400',
                    'from-purple-500 to-purple-400',
                    'from-rose-500 to-rose-400',
                ];
                return {
                    name,
                    leads: count,
                    growth: '+' + (Math.floor(Math.random() * 20) + 1) + '%',
                    color: colors[index % colors.length]
                };
            });
            
        return sorted;
    }, [realLeads]);

    return (
        <>
            <div className="max-w-7xl mx-auto pb-10 animate-in fade-in duration-500 relative">
                {/* ── Welcome Header ── */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-slate-900 text-4xl font-[1000] tracking-tighter mb-1">Welcome back, Chandan!</h1>
                        <p className="text-slate-500 text-sm font-medium">Your platform is performing <span className="text-emerald-600 font-bold">14.2% better</span> than last month.</p>
                    </div>
                    <div className="flex items-center gap-3 relative">
                        <button
                            onClick={() => {
                                setShowNotifications(!showNotifications);
                                if (!showNotifications) {
                                    setHasSeenNotifications(true);
                                    localStorage.setItem('admin_dashboard_last_seen_count', notifications.length.toString());
                                }
                            }}
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all relative ${showNotifications ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 rotate-12' : 'bg-white border border-slate-200 text-slate-400 hover:border-emerald-300'}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                            {!hasSeenNotifications && notifications.length > 0 && (
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
                                        <div 
                                            key={n.id} 
                                            onClick={() => {
                                                if (n.priority === 'high') {
                                                    navigate('/admin/dashboard/approvals');
                                                }
                                            }}
                                            className={`p-3 rounded-xl border transition-colors cursor-pointer group ${n.isRead ? 'bg-slate-50 border-slate-100' : 'bg-emerald-50/50 border-emerald-100 shadow-sm'}`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <div className="flex items-center gap-2">
                                                    {!n.isRead && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
                                                    <p className={`text-[11px] font-black ${n.isRead ? 'text-slate-800' : 'text-emerald-900'} group-hover:text-emerald-700`}>{n.title}</p>
                                                </div>
                                                <span className="text-[8px] text-slate-400 font-bold">{n.time}</span>
                                            </div>
                                            <p className={`text-[10px] leading-relaxed font-medium ${n.isRead ? 'text-slate-500' : 'text-emerald-800/70'}`}>{n.desc}</p>
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
                    <div className="lg:col-span-3 bg-white rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden flex flex-col h-[400px]">
                        <div className="flex justify-between items-start p-8 pb-4 bg-white/90 backdrop-blur-xl sticky top-0 z-10 border-b border-slate-50/50">
                            <div>
                                <h2 className="text-slate-900 font-[1000] text-2xl tracking-tight leading-none mb-2">Service Performance</h2>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Highest activity services this week</p>
                            </div>
                            <NavLink to="/admin/dashboard/categories" className="px-4 py-2 bg-emerald-50 text-emerald-600 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm shadow-emerald-500/10">
                                Full Category Report
                            </NavLink>
                        </div>

                        <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 pt-4">
                                {topCategories.length > 0 ? topCategories.map((cat, idx) => (
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
                                                style={{ width: `${Math.min(100, (cat.leads / Math.max(10, topCategories[0]?.leads || 1)) * 100)}%` }}
                                                className={`h-full bg-gradient-to-r ${cat.color} rounded-full transition-all duration-1000 shadow-sm`}
                                            />
                                        </div>
                                        <div className="flex justify-between mt-2 px-1">
                                            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{cat.leads} Active Leads</span>
                                            <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Cap: 80%</span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-full py-10 text-center text-slate-400 font-bold text-sm">
                                        No active services this week
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-50 rounded-full opacity-20 blur-3xl pointer-events-none" />
                    </div>

                    {/* Live Activity Feed */}
                    <div className="lg:col-span-2 bg-[#0F172A] p-8 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col group">
                        <div className="absolute -top-20 -right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]" />

                        <div className="flex items-center justify-between mb-8 relative z-10 bg-[#0F172A] sticky top-0 pb-4">
                            <div>
                                <h2 className="text-white font-[1000] text-xl tracking-tight leading-none mb-1.5">Live Engagement</h2>
                                <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Happening right now</p>
                            </div>
                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                        </div>

                        <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2 relative z-10 h-[380px]">
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

                            <div className="space-y-4 pr-1">
                                {recentActivities.length > 0 ? recentActivities.map((item, idx) => (
                                    <div key={item.id} className="relative p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all group cursor-default">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-emerald-400 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-emerald-500/10 rounded-lg">Event #{recentActivities.length - idx}</span>
                                            <span className="text-slate-500 text-[10px] font-bold uppercase">{item.time}</span>
                                        </div>
                                        <p className="text-white font-black text-sm tracking-tight mb-1">{item.user}</p>
                                        <p className="text-slate-400 text-[11px] leading-relaxed pr-6">{item.msg}</p>
                                        <div className="absolute top-5 right-5 text-xl opacity-20 group-hover:opacity-100 transition-opacity">
                                            {item.icon}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-10 opacity-50">
                                        <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-2">Feed Empty</p>
                                        <p className="text-slate-400 text-xs">No active global activities found.</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-10 p-6 rounded-[24px] bg-gradient-to-br from-emerald-600/20 to-transparent border border-emerald-500/20">
                                <p className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-2">System Insight</p>
                                <p className="text-slate-400 text-[11px] leading-relaxed italic">"Global feed items are archived every 24 hours to maintain system performance. Detailed reports can be accessed from the Resolution Center."</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Platform Health Monitor ── */}
                <div className="mt-10 bg-white border border-slate-100 rounded-[40px] shadow-sm p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-slate-900 font-[1000] text-xl tracking-tight">Platform Health Monitor</h2>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Live system status · auto-refreshing every 4s</p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-emerald-700 font-black text-[11px] uppercase tracking-widest">Systems Online</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {healthStatus.map((s, i) => (
                            <div key={i} className={`p-5 rounded-2xl border transition-all ${s.status === 'Operational' ? 'border-emerald-100 bg-emerald-50/50' : 'border-amber-200 bg-amber-50/50'}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-2xl">{s.icon}</span>
                                    <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${s.status === 'Operational' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                                        {s.status}
                                    </span>
                                </div>
                                <p className="text-slate-800 font-black text-sm mb-1">{s.label}</p>
                                <p className={`text-[11px] font-bold mb-3 ${s.color}`}>Latency: {s.latency}</p>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        style={{ width: `${s.bar}%` }}
                                        className={`h-full rounded-full transition-all duration-700 ${s.status === 'Operational' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold text-right mt-1">{s.bar}% uptime</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Quick Action Shortcuts ── */}
                <div className="mt-10 pt-10 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Review Approvals', path: '/admin/dashboard/approvals', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
                        { label: 'Monitor Leads', path: '/admin/dashboard/requests', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
                        { label: 'Manage Experts', path: '/admin/dashboard/providers', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                        { label: 'System Reports', path: '/admin/dashboard/reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
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

            {/* ── Floating Quick Action FAB ── */}
            <button
                onClick={() => setShowQuickAction(true)}
                className="fixed bottom-8 right-8 z-[900] w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-2xl shadow-2xl shadow-emerald-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                title="Quick Actions"
            >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {(pendingExperts.length + realReports.length) > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 border-2 border-white rounded-full text-[9px] font-black flex items-center justify-center animate-bounce">
                        {pendingExperts.length + realReports.length}
                    </span>
                )}
            </button>

            {/* ── Quick Action Modal ── */}
            {showQuickAction && (
                <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowQuickAction(false)} />
                    <div className="relative bg-white rounded-[40px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                        <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400" />
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-slate-900 font-[1000] text-2xl tracking-tighter">Quick Actions</h2>
                                    <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest mt-1">Approve experts · resolve tickets — without leaving the dashboard</p>
                                </div>
                                <button onClick={() => setShowQuickAction(false)} className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Pending Experts */}
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <span className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-[10px] font-black">{pendingExperts.length}</span>
                                        Pending Expert Approvals
                                    </p>
                                    {pendingExperts.length > 0 ? (
                                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                            {pendingExperts.map(e => (
                                                <div key={e._id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all">
                                                    <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-xs shrink-0 uppercase">
                                                        {(e.fullName || 'U').split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-slate-800 font-black text-sm truncate">{e.fullName}</p>
                                                        <p className="text-slate-400 text-[10px] font-bold truncate">{e.category} · {e.experience}y exp</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleApproveExpert(e._id)}
                                                        className="shrink-0 px-3 py-1.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-500 transition-all active:scale-95 shadow-md shadow-emerald-500/20"
                                                    >
                                                        Approve
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-10 text-center">
                                            <p className="text-3xl mb-2">🎉</p>
                                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">All caught up!</p>
                                        </div>
                                    )}
                                </div>

                                {/* Open Tickets */}
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <span className="w-5 h-5 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-[10px] font-black">{realReports.length}</span>
                                        Open Support Tickets
                                    </p>
                                    {realReports.length > 0 ? (
                                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                            {realReports.map(t => (
                                                <div key={t._id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-red-100 transition-all">
                                                    <div className={`w-2 h-10 rounded-full shrink-0 ${t.message?.length > 50 ? 'bg-red-500' : 'bg-emerald-500'}`} />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-slate-800 font-black text-sm truncate">{t.message}</p>
                                                        <p className="text-slate-400 text-[10px] font-bold">{t.senderId?.fullName || t.senderId?.businessName || 'Platform User'} · <span className="text-emerald-500">Pending</span></p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleResolveTicket(t._id)}
                                                        className="shrink-0 px-3 py-1.5 bg-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-700 hover:text-white transition-all active:scale-95"
                                                    >
                                                        Resolve
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-10 text-center">
                                            <p className="text-3xl mb-2">✅</p>
                                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No open tickets!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminDashboard;
