import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProviderProfile, getProviderDashboard, getIncomingLeads, toggleOnlineStatus, getReports } from '../../../api/providerApi';
import axiosInstance from '../../../api/axiosInstance';

const ProviderHome = () => {
    const navigate = useNavigate();
    const [isOnline, setIsOnline] = useState(false);
    const [showNotifs, setShowNotifs] = useState(false);
    const [provider, setProvider] = useState(null);
    const [dashboard, setDashboard] = useState({ totalLeads: 0, pendingLeads: 0, workersCount: 0 });
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastRead, setLastRead] = useState(localStorage.getItem('provider_notif_last_read') || '1970-01-01T00:00:00.000Z');
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchData = async () => {
        try {
            const [prof, dash, leads] = await Promise.all([
                getProviderProfile(),
                getProviderDashboard(),
                getIncomingLeads()
            ]);
            if (prof) {
                setProvider(prof);
                setIsOnline(prof.isOnline);

                // Update localStorage with fresh subscription expiry to ensure navbar matches database
                const localData = JSON.parse(localStorage.getItem('cc_provider_data') || '{}');
                const updatedData = { ...localData, ...prof };
                if (prof.subscriptionExpiry) updatedData.subscriptionExpiry = prof.subscriptionExpiry;
                localStorage.setItem('cc_provider_data', JSON.stringify(updatedData));
            }
            if (dash) setDashboard(dash);
            let notifArr = [];
            if (leads && Array.isArray(leads)) {
                notifArr = leads.filter(l => l.status === 'pending');
            }
            try {
                const repRes = await getReports();
                let reports = [];
                if (Array.isArray(repRes)) {
                    reports = repRes;
                } else if (repRes?.data && Array.isArray(repRes.data)) {
                    reports = repRes.data;
                } else if (repRes?.data?.data && Array.isArray(repRes.data.data)) {
                    reports = repRes.data.data;
                }

                if (reports.length > 0) {
                    const resolvedReps = reports
                        .filter(r => r.status === 'Resolved' && r.reply)
                        .map(r => ({
                            _id: r._id,
                            clientName: 'Support Team Reply',
                            serviceType: r.reply,
                            projectType: 'Report Response',
                            budget: 'Support',
                            createdAt: r.updatedAt,
                            isReport: true
                        }));
                    notifArr = [...notifArr, ...resolvedReps].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
                }
            } catch (e) { console.error('Error fetching reports for drawer', e); }

            setNotifications(notifArr);
            
            // Calculate unread count
            const currentLastRead = localStorage.getItem('provider_notif_last_read') || '1970-01-01T00:00:00.000Z';
            const unread = notifArr.filter(n => new Date(n.createdAt) > new Date(currentLastRead)).length;
            setUnreadCount(unread);
        } catch (err) {
            console.error("Failed to load provider dashboard:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Setup simple dynamic interval to keep stats and leads completely real-time
        const intervalId = setInterval(() => {
            fetchData();
        }, 8000); // 8-second refresh loop
        
        return () => clearInterval(intervalId);
    }, []);

    const handleToggleStatus = async () => {
        const newStatus = !isOnline;
        try {
            // Optimistically update
            setIsOnline(newStatus);
            await toggleOnlineStatus(newStatus);
        } catch (err) {
            setIsOnline(!newStatus); // Rollback on fail
            alert("Failed to update status");
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-10">
            {/* ── Sticky Top Header ── */}
            <div className="bg-gradient-to-br from-[#1E3A8A] to-indigo-900 px-4 pt-8 pb-6 rounded-b-[32px] shadow-lg sticky top-0 z-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md overflow-hidden border border-white/20 shadow-sm flex items-center justify-center">
                                {provider?.profileImage ? (
                                    <img src={provider.profileImage} alt="Profile" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                                ) : (
                                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(provider?.fullName || 'Provider')}&background=ffffff&color=1E3A8A`} alt="Profile" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                                )}
                            </div>
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-[#1E3A8A] rounded-full ${isOnline ? 'bg-green-400' : 'bg-slate-400'}`} />
                        </div>
                        <div>
                            <p className="text-blue-200/60 text-[11px] font-bold tracking-wider">Welcome,</p>
                            <h1 className="text-white text-xl font-[1000] tracking-tight">{provider?.fullName || 'Expert'}</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 relative">
                        <div className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${isOnline ? 'bg-green-400/20 text-green-400 border border-green-400/30' : 'bg-white/10 text-white/60 border border-white/10'}`}>
                            {isOnline ? 'Active' : 'Busy'}
                        </div>
                        <button
                            onClick={() => {
                                setShowNotifs(!showNotifs);
                                if (!showNotifs) {
                                    const now = new Date().toISOString();
                                    setLastRead(now);
                                    localStorage.setItem('provider_notif_last_read', now);
                                    setUnreadCount(0);
                                }
                            }}
                            className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 text-white active:scale-90 transition-transform relative"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-[#1E3A8A] animate-bounce">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Premium Side Drawer Notifications */}
                        {showNotifs && (
                            <>
                                {/* Backdrop */}
                                <div
                                    onClick={() => setShowNotifs(false)}
                                    style={{
                                        position: 'fixed', inset: 0,
                                        background: 'rgba(0,0,0,0.3)',
                                        backdropFilter: 'blur(4px)',
                                        zIndex: 2000,
                                        animation: 'fadeIn 0.3s ease'
                                    }}
                                />
                                {/* Drawer */}
                                <div style={{
                                    position: 'fixed', top: 0, right: 0,
                                    width: '85%', maxWidth: '340px', height: '100vh',
                                    background: '#fff',
                                    boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
                                    zIndex: 3000,
                                    display: 'flex', flexDirection: 'column',
                                    animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}>
                                    <div style={{ padding: '24px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '1000', color: '#1E3A8A', letterSpacing: '0.8px', textTransform: 'uppercase' }}>NOTIFICATIONS</h4>
                                        <button
                                            onClick={() => setShowNotifs(false)}
                                            style={{ border: 'none', background: '#F8FAFC', width: '32px', height: '32px', borderRadius: '10px', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >✕</button>
                                    </div>

                                    <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
                                        {notifications.length === 0 ? (
                                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                                <div style={{ fontSize: '40px', marginBottom: 16 }}>🎯</div>
                                                <p style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '700' }}>No new leads today.</p>
                                                <p style={{ fontSize: '11px', color: '#CBD5E1', mt: 4 }}>Stay online to catch new requests!</p>
                                            </div>
                                        ) : (
                                            notifications.map((notif, idx) => {
                                                const clientName = notif.clientName || notif.userId?.fullName || 'New Client';
                                                const serviceType = (notif.serviceType && notif.serviceType.toLowerCase() !== 'provider')
                                                    ? notif.serviceType
                                                    : notif.projectType || 'General Service';
                                                return (
                                                <div
                                                    key={notif._id}
                                                    onClick={() => { navigate(notif.isReport ? '/serviceprovider/profile' : '/serviceprovider/requests'); setShowNotifs(false); }}
                                                    style={{
                                                        padding: '18px', borderRadius: '20px', background: notif.isReport ? '#F0F9FF' : '#F8FAFC',
                                                        border: '1px solid', borderColor: notif.isReport ? '#E0F2FE' : '#F1F5F9', position: 'relative', cursor: 'pointer',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                                        <h5 style={{ margin: 0, fontSize: '14px', fontWeight: '900', color: '#1E3A8A' }}>{clientName}</h5>
                                                        <span style={{ fontSize: '10px', fontWeight: '900', color: '#6366F1', textTransform: 'uppercase' }}>
                                                            {new Date(notif.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: '600', color: '#64748B' }}>{serviceType}</p>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span style={{ fontSize: '12px', fontWeight: '1000', color: notif.isReport ? '#0369A1' : '#10B981' }}>
                                                            {notif.isReport ? 'SUPPORT RESOLVED' : (notif.budget && notif.budget !== 'Negotiable' ? `₹${notif.budget}` : notif.budget || 'Negotiable')}
                                                        </span>
                                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: notif.isReport ? '#0369A1' : '#6366F1', boxShadow: `0 0 8px ${notif.isReport ? 'rgba(3, 105, 161, 0.4)' : 'rgba(99, 102, 241, 0.4)'}` }} />
                                                    </div>
                                                </div>
                                                );
                                            })
                                        )}
                                    </div>

                                    <div style={{ padding: '20px', background: '#F8FAFC', borderTop: '1px solid #F1F5F9' }}>
                                        <button
                                            onClick={() => { setShowNotifs(false); navigate('/serviceprovider/requests'); }}
                                            style={{
                                                width: '100%', padding: '16px', borderRadius: '16px', border: 'none',
                                                background: 'linear-gradient(135deg, #1E3A8A 0%, #4F46E5 100%)',
                                                color: '#fff', fontSize: '12px', fontWeight: '1000', cursor: 'pointer',
                                                boxShadow: '0 8px 20px rgba(30, 58, 138, 0.2)', textTransform: 'uppercase',
                                                letterSpacing: '1px'
                                            }}
                                        >
                                            VIEW ALL ACTIVITY
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="px-6 pt-4 space-y-5">
                {/* Status Toggle Card */}
                <div className="bg-[#1E3A8A] rounded-2xl p-5 shadow-xl shadow-blue-900/10 relative overflow-hidden group transition-all active:scale-[0.98]">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 group-hover:scale-125 transition-transform duration-700" />
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-blue-200 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Visibility Status</p>
                            <h2 className="text-white text-lg font-bold tracking-tight">{isOnline ? 'Accepting new leads' : 'Currently working/busy'}</h2>
                        </div>
                        <button
                            onClick={handleToggleStatus}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none p-1 ${isOnline ? 'bg-blue-400' : 'bg-white/10'}`}
                        >
                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-300 shadow-md ${isOnline ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between h-28 active:scale-95 transition-transform hover:shadow-md cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        </div>
                        <div>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-0.5">Total Requests</p>
                            <p className="text-xl font-[1000] text-slate-900 leading-none">{dashboard.totalLeads}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between h-28 active:scale-95 transition-transform hover:shadow-md cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-inner">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-0.5">Pending Leads</p>
                            <p className="text-xl font-[1000] text-slate-900 leading-none">{dashboard.pendingLeads}</p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Shortcuts */}
                <div>
                    <h3 className="text-slate-900 font-extrabold text-[15px] mb-3.5 px-1">Shortcuts</h3>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/serviceprovider/profile')}
                            className="flex-1 bg-white border border-slate-100 p-5 rounded-2xl flex flex-col gap-3 items-center active:scale-95 transition-all shadow-sm group hover:shadow-md"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-inner">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                            <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest text-center leading-tight">Complete<br />Profile</span>
                        </button>
                        <button
                            onClick={() => navigate('/serviceprovider/profile')}
                            className="flex-1 bg-white border border-slate-100 p-5 rounded-2xl flex flex-col gap-3 items-center active:scale-95 transition-all shadow-sm group hover:shadow-md"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-inner">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                            <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest text-center leading-tight">Upload<br />Work</span>
                        </button>
                    </div>
                </div>

                {/* Section: New Requests */}
                <div>
                    <div className="flex items-center justify-between mb-3.5 px-1">
                        <h3 className="text-slate-900 font-extrabold text-[15px]">Latest Activity</h3>
                        <button onClick={() => navigate('/serviceprovider/requests')} className="text-[#1E3A8A] font-black text-[11px] uppercase tracking-wider hover:underline">See Leads</button>
                    </div>

                    <div className="space-y-3">
                        {loading ? (
                            <div className="text-center py-4 text-slate-400 text-[10px] font-black uppercase">Loading activity...</div>
                        ) : notifications.length === 0 ? (
                            <div className="text-center py-4 text-slate-400 text-[10px] font-black uppercase text-center">No recent activity</div>
                        ) : (
                            notifications.slice(0, 3).map(notif => (
                                <div key={notif._id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-50 flex items-center justify-between active:scale-[0.98] transition-all hover:shadow-md cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl shadow-inner">
                                            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="text-slate-900 font-extrabold text-[15px]">{notif.clientName}</h4>
                                            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">{notif.serviceType} • {new Date(notif.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <span className="bg-amber-50 text-amber-600 text-[9px] font-black px-3 py-1 rounded-full border border-amber-100 uppercase tracking-widest shadow-sm">New</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Subscription Quick View */}
                <div
                    onClick={() => navigate('/serviceprovider/subscription')}
                    className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer hover:shadow-md"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <div>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-0.5">Active Plan</p>
                            <h4 className="text-slate-900 text-[15px] font-[1000] tracking-tight m-0">Professional Pro</h4>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[#1E3A8A] text-[11px] font-black uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">15 Days Left</p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default ProviderHome;
