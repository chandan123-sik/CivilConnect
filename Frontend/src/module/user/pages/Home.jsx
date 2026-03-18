import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ClipboardList, CheckCircle } from 'lucide-react';
import { getHomeUnified } from '../../../api/publicApi';
import { getOrders, getHiringHistory, getUserProfile, getReports } from '../../../api/userApi';
import axiosInstance from '../../../api/axiosInstance';

const PromoBanners = ({ banners }) => {
    const bannerRef = useRef(null);
    const [currentBanner, setCurrentBanner] = useState(0);

    useEffect(() => {
        if (!banners || banners.length === 0) return;
        const interval = setInterval(() => {
            if (bannerRef.current) {
                const next = (currentBanner + 1) % banners.length;
                const cardWidth = bannerRef.current.offsetWidth || (window.innerWidth - 28);
                const gap = 28;
                bannerRef.current.scrollTo({
                    left: next * (cardWidth + gap),
                    behavior: 'smooth'
                });
                setCurrentBanner(next);
            }
        }, 4000);
        return () => clearInterval(interval);
    }, [currentBanner, banners?.length]);

    const handleScroll = (e) => {
        const scrollLeft = e.target.scrollLeft;
        const cardWidth = window.innerWidth - 28;
        const gap = 28;
        const index = Math.round(scrollLeft / (cardWidth + gap));
        if (index !== currentBanner && index >= 0 && index < banners.length) {
            setCurrentBanner(index);
        }
    };

    if (!banners || banners.length === 0) return null;

    return (
        <div style={{ position: 'relative', marginBottom: 0 }}>
            <div
                ref={bannerRef}
                onScroll={handleScroll}
                style={{
                    display: 'flex',
                    overflowX: 'auto',
                    padding: '16px 14px 0',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    scrollSnapType: 'x mandatory',
                    gap: 28
                }} className="hide-scrollbar">
                {banners.map((item, idx) => (
                    <div key={idx} style={{
                        position: 'relative',
                        minWidth: 'calc(100vw - 28px)',
                        width: 'calc(100vw - 28px)',
                        height: '160px',
                        borderRadius: '20px',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                        scrollSnapAlign: 'start',
                        border: '1px solid rgba(255,255,255,0.2)',
                        overflow: 'hidden'
                    }}>
                        <img 
                            src={item.image || item.img} 
                            alt={item.title} 
                            fetchPriority={idx === 0 ? "high" : "low"} 
                            loading={idx === 0 ? "eager" : "lazy"} 
                            decoding="async" 
                            crossOrigin="anonymous"
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} 
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 70%)', zIndex: 1 }} />
                        <div style={{ position: 'relative', zIndex: 2 }}>
                            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '22px', fontWeight: '900', color: '#fff', margin: '0 0 6px 0', lineHeight: 1.2, textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                                {item.title}
                            </h3>
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#fff', margin: 0, maxWidth: '280px', fontWeight: '500', textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
                                {item.description || item.desc || item.subtitle}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Banner Indicators (Dots) */}
            <div style={{
                display: 'flex', justifyContent: 'center', gap: 6, marginTop: 12
            }}>
                {banners.map((_, idx) => (
                    <div key={idx} style={{
                        width: currentBanner === idx ? '20px' : '6px',
                        height: '6px',
                        borderRadius: '3px',
                        background: currentBanner === idx ? '#7C3AED' : '#E5E7EB',
                        transition: 'all 0.3s ease'
                    }} />
                ))}
            </div>
        </div>
    );
};

const Home = () => {
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [userNotifications, setUserNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastRead, setLastRead] = useState(localStorage.getItem('user_notif_last_read') || '1970-01-01T00:00:00.000Z');
    const [hasUnread, setHasUnread] = useState(false);
    
    const [homeData, setHomeData] = useState({
        user: null,
        banners: [],
        categories: [],
        providers: [],
        materials: []
    });

    const loadNotifications = async () => {
        try {
            let reportsArr = [];
            const [orders, leads] = await Promise.all([getOrders(), getHiringHistory()]);
            
            try {
                const repRes = await getReports();
                // Handle different response formats from axiosInstance
                if (Array.isArray(repRes)) {
                    reportsArr = repRes;
                } else if (repRes?.data && Array.isArray(repRes.data)) {
                    reportsArr = repRes.data;
                } else if (repRes?.data?.data && Array.isArray(repRes.data.data)) {
                    reportsArr = repRes.data.data;
                }
            } catch (e) { 
                console.error("Support reports fetch fail:", e); 
            }
            
            const orderUpdates = (orders || []).filter(o => o.status !== 'pending').map(o => ({
                id: o._id,
                status: o.status,
                title: o.materialName,
                subtitle: o.brand,
                type: 'Material',
                createdAt: o.createdAt
            }));

            const leadUpdates = (leads || []).filter(l => l.status !== 'pending' && l.providerId).map(l => ({
                id: l._id,
                status: l.status,
                title: l.providerId?.fullName || l.serviceType || 'Service Request',
                subtitle: l.serviceType,
                type: 'Service',
                createdAt: l.createdAt
            }));

            const reportUpdates = reportsArr.filter(r => r.status === 'Resolved' && r.reply).map(r => ({
                id: r._id,
                status: 'replied',
                title: 'Support Team Reply',
                subtitle: r.reply,
                type: 'Support',
                createdAt: r.updatedAt
            }));

            const combined = [...orderUpdates, ...leadUpdates, ...reportUpdates].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setUserNotifications(combined);
            
            // Calculate unread status using strict timestamp comparison
            if (combined.length > 0) {
                const latestNotifTime = new Date(combined[0].createdAt).getTime();
                const lastReadTime = parseInt(localStorage.getItem('user_notif_last_read_ts') || '0');
                setHasUnread(latestNotifTime > lastReadTime);
            } else {
                setHasUnread(false);
            }
        } catch (err) {
            console.error("Critical Notification Error:", err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch unified data + User Profile in parallel
                const [unifiedRes, profileRes] = await Promise.all([
                    getHomeUnified(),
                    getUserProfile()
                ]);

                const defaultBanners = [
                    { title: 'Premium Construction Materials', description: 'Get daily updated rates for cement, steel and more.', image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=70&fm=webp' },
                    { title: 'Verified Expert Manpower', description: 'Directly connect with top-rated contractors & engineers.', image: 'https://images.unsplash.com/photo-1503387762-592dea58ef21?w=800&q=70&fm=webp' },
                    { title: 'Quality Site Management', description: 'Track progress and manage your construction site efficiently.', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=70&fm=webp' }
                ];

                setHomeData({
                    user: profileRes,
                    banners: [...(unifiedRes.banners || []).map(b => ({ ...b, image: `${b.image || b.img}${ (b.image || b.img).includes('?') ? '&' : '?' }w=800&q=70&fm=webp` })), ...defaultBanners],
                    categories: unifiedRes.categories || [],
                    providers: unifiedRes.providers || [],
                    materials: unifiedRes.materials || []
                });

                // Load notifications in background without blocking
                setTimeout(loadNotifications, 1000);

            } catch (err) {
                console.error("Home data fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (showNotifications) {
            document.body.style.overflow = 'hidden';
            if (window.lenis) window.lenis.stop();
        } else {
            document.body.style.overflow = 'unset';
            if (window.lenis) window.lenis.start();
        }
        return () => { 
            document.body.style.overflow = 'unset'; 
            if (window.lenis) window.lenis.start();
        };
    }, [showNotifications]);


    return (
        <div style={{ paddingBottom: 20 }}>
            {/* Header / Top Bar */}
            <header style={{
                padding: '22px 20px 20px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                borderRadius: '0 0 32px 32px',
                boxShadow: '0 10px 30px rgba(124, 58, 237, 0.2)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                    <div style={{ flex: 1, minWidth: 0, marginRight: 15 }}>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: 'rgba(255,255,255,0.8)', margin: '0 0 4px 0', fontWeight: '800', display: 'flex', alignItems: 'center', gap: 6, opacity: 0.9 }}>
                            Good day <span style={{ fontSize: '18px' }}>👋</span>
                        </p>
                        <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: '22px', fontWeight: '900', color: '#fff', margin: 0, letterSpacing: '-0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {homeData.user?.fullName || 'Guest'}
                        </h1>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(10px)',
                            padding: '8px 14px',
                            borderRadius: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}>
                            <span style={{ fontSize: '14px' }}>📍</span>
                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: '700', color: '#fff' }}>{homeData.user?.city || 'India'}</span>
                        </div>

                        {/* Notification Bell */}
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => {
                                    setShowNotifications(!showNotifications);
                                    if (!showNotifications) {
                                        const nowTs = Date.now().toString();
                                        localStorage.setItem('user_notif_last_read_ts', nowTs);
                                        setHasUnread(false);
                                    }
                                }}
                                style={{
                                    width: '38px', height: '38px', borderRadius: '12px',
                                    background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                    transition: 'all 0.2s', position: 'relative', backdropFilter: 'blur(10px)'
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" /></svg>
                                {hasUnread && <span style={{ position: 'absolute', top: '8px', right: '8px', width: '7px', height: '7px', background: '#EF4444', borderRadius: '50%', border: '1.5px solid #7C3AED', boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)' }} />}
                            </button>

                            {/* Premium Side Drawer Notifications */}
                            {showNotifications && (
                                <>
                                    {/* Backdrop */}
                                    <div
                                        onClick={() => setShowNotifications(false)}
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
                                        position: 'fixed', top: 0, right: 0, bottom: 0,
                                        width: '85%', maxWidth: '340px',
                                        background: '#fff',
                                        boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
                                        zIndex: 3000,
                                        display: 'flex', flexDirection: 'column',
                                        animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                                    }}>
                                        <div style={{ padding: '24px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: '#111827', letterSpacing: '0.5px' }}>NOTIFICATIONS</h4>
                                            <button
                                                onClick={() => setShowNotifications(false)}
                                                style={{ border: 'none', background: '#F8FAFC', width: '32px', height: '32px', borderRadius: '10px', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >✕</button>
                                        </div>

                                        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
                                            {userNotifications.length === 0 ? (
                                                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                                    <div style={{ fontSize: '40px', marginBottom: 16 }}>🔔</div>
                                                    <p style={{ fontSize: '14px', color: '#94A3B8', fontWeight: '500' }}>No notifications yet.</p>
                                                </div>
                                            ) : (
                                                userNotifications.map(notif => (
                                                    <div key={notif.id} 
                                                        onClick={() => {
                                                            setShowNotifications(false);
                                                            if (notif.type === 'Material') {
                                                                navigate('/user/materials?view=orders');
                                                            } else if (notif.type === 'Support') {
                                                                navigate('/user/profile');
                                                            } else {
                                                                navigate('/user/requests');
                                                            }
                                                        }}
                                                        style={{ 
                                                            padding: '16px', 
                                                            borderRadius: '20px', 
                                                            background: notif.type === 'Support' ? '#F0F9FF' : (notif.status === 'accepted' ? '#F0FDF4' : '#FEF2F2'), 
                                                            border: '1px solid', 
                                                            borderColor: notif.type === 'Support' ? '#E0F2FE' : (notif.status === 'accepted' ? '#DCFCE7' : '#FEE2E2'),
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                                            <h5 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#1F2937' }}>{notif.title}</h5>
                                                            <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '600' }}>
                                                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                        <p style={{ margin: 0, fontSize: '12px', color: notif.type === 'Support' ? '#0369A1' : (notif.status === 'accepted' ? '#15803D' : '#B91C1C'), fontWeight: '700' }}>
                                                            {notif.type}: {notif.status.charAt(0).toUpperCase() + notif.status.slice(1)}
                                                        </p>
                                                        <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#64748B', fontWeight: '500' }}>
                                                            {notif.subtitle}
                                                        </p>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        <div style={{ padding: '16px 20px 32px 20px', background: '#F8FAFC', borderTop: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                            {userNotifications.some(n => n.type === 'Material') && (
                                                <button
                                                    onClick={() => { setShowNotifications(false); navigate('/user/materials?view=orders'); }}
                                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)', color: '#fff', fontSize: '12px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)' }}
                                                >
                                                    📦 VIEW MATERIAL ORDERS
                                                </button>
                                            )}
                                            {userNotifications.some(n => n.type === 'Service') && (
                                                <button
                                                    onClick={() => { setShowNotifications(false); navigate('/user/requests'); }}
                                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)', color: '#fff', fontSize: '12px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 12px rgba(30, 58, 138, 0.2)' }}
                                                >
                                                    🔧 VIEW SERVICE REQUESTS
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Horizontal Promo Banners */}
            <PromoBanners banners={homeData.banners} />

            {/* Horizontal Categories Scroll */}
            {useMemo(() => (
                <section style={{ padding: '0 0 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', marginBottom: 10 }}>
                        <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px', fontWeight: '800', color: '#1F2937', margin: 0 }}>
                            Categories
                        </h2>
                        <button
                            onClick={() => navigate('/user/categories')}
                            style={{ background: 'none', border: 'none', color: '#7C3AED', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                        >
                            View All
                        </button>
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        overflowX: 'auto',
                        padding: '2px 20px 10px',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        scrollSnapType: 'x mandatory'
                    }} className="hide-scrollbar">
                        {homeData.categories.map(cat => (
                            <div
                                key={cat._id}
                                onClick={() => navigate(`/user/categories/${cat._id}`)}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', flexShrink: 0, minWidth: '78px', scrollSnapAlign: 'start' }}
                            >
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    background: '#fff',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '26px',
                                    boxShadow: '0 6px 16px rgba(124, 58, 237, 0.08)',
                                    border: '1px solid rgba(124, 58, 237, 0.08)',
                                    transition: 'all 0.3s ease'
                                }}
                                    className="category-card-hover"
                                >
                                    {cat.icon && typeof cat.icon === 'string' && cat.icon.startsWith('http') ? (
                                        <img src={cat.icon} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={cat.label} />
                                    ) : (cat.icon || '🛠️')}
                                </div>
                                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: '800', color: '#1F2937', textAlign: 'center', width: '74px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {cat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            ), [homeData.categories, navigate])}

            {/* Popular Providers Horizontal Scroll */}
            {useMemo(() => (
                <section style={{ padding: '0 0 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', marginBottom: 16 }}>
                        <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '17px', fontWeight: '800', color: '#1F2937', margin: 0 }}>
                            Popular Experts
                        </h2>
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: 16,
                        overflowX: 'auto',
                        padding: '4px 16px 10px',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                    }} className="hide-scrollbar">
                        {homeData.providers.map(provider => (
                            <div
                                key={provider._id}
                                onClick={() => navigate(`/user/provider/${provider._id}`)}
                                style={{
                                    minWidth: '160px',
                                    background: '#fff',
                                    borderRadius: '20px',
                                    padding: '18px',
                                    boxShadow: '0 8px 20px rgba(124, 58, 237, 0.06)',
                                    border: '1px solid rgba(124, 58, 237, 0.04)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    minHeight: '190px',
                                    justifyContent: 'center'
                                }}
                            >
                                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#F3F4F6', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', overflow: 'hidden' }}>
                                    {provider.profileImage ? <img src={provider.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" decoding="async" crossOrigin="anonymous" alt={provider.fullName} /> : (provider.category === 'contractor' ? '🏗️' : '👤')}
                                </div>
                                <h4 style={{ 
                                    fontFamily: "'Inter', sans-serif", 
                                    fontSize: '14px', 
                                    fontWeight: '800', 
                                    color: '#1F2937', 
                                    margin: '0 0 4px 0', 
                                    wordBreak: 'break-word',
                                    lineHeight: '1.2',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}>
                                    {provider.fullName}
                                </h4>
                                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#6B7280', margin: '0 0 12px 0', fontWeight: '500' }}>{provider.role || provider.category}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <span style={{ fontSize: '14px' }}>⭐</span>
                                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: '800', color: '#1F2937' }}>{provider.rating || '4.5'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ), [homeData.providers, navigate])}

            {/* Popular Materials Horizontal Scroll */}
            {useMemo(() => (
                <section style={{ padding: '0 0 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', marginBottom: 16 }}>
                        <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '17px', fontWeight: '800', color: '#1F2937', margin: 0 }}>
                            Popular Materials
                        </h2>
                        <button
                            onClick={() => navigate('/user/materials')}
                            style={{ background: 'none', border: 'none', color: '#7C3AED', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                        >
                            View All
                        </button>
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: 16,
                        overflowX: 'auto',
                        padding: '4px 16px 10px',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                    }} className="hide-scrollbar">
                        {homeData.materials.map(m => (
                            <div
                                key={m._id}
                                onClick={() => navigate('/user/materials')}
                                style={{
                                    minWidth: 'calc((100% - 16px) / 2)',
                                    width: 'calc((100% - 16px) / 2)',
                                    background: '#fff',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    boxShadow: '0 8px 20px rgba(124, 58, 237, 0.05)',
                                    border: '1px solid rgba(124, 58, 237, 0.04)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <div style={{ height: '90px', width: '100%', overflow: 'hidden', background: '#F3F4F6' }}>
                                    <img src={m.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" decoding="async" crossOrigin="anonymous" alt={m.name} />
                                </div>
                                <div style={{ padding: '12px' }}>
                                    <div style={{ fontSize: '10px', color: '#7C3AED', fontWeight: '800', textTransform: 'uppercase', marginBottom: 4, letterSpacing: '0.02em' }}>
                                        {m.category}
                                    </div>
                                    <h4 style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: '800', color: '#1F2937', margin: '0 0 4px 0', lineClamp: 1, overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 1 }}>
                                        {m.name}
                                    </h4>
                                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#10B981', margin: 0, fontWeight: '900' }}>
                                        ₹{m.price} <span style={{ color: '#6B7280', fontSize: '10px', fontWeight: '600' }}>{m.unit}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ), [homeData.materials, navigate])}

            {/* How It Works Section */}
            <section style={{ padding: '10px 16px 20px' }}>
                <div style={{
                    background: '#fff',
                    borderRadius: '24px',
                    padding: '32px 24px',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.03)',
                    border: '1px solid #F8F9FA',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: '#F5F3FF', borderRadius: '50%', opacity: 0.5 }} />

                    <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '19px', fontWeight: '900', color: '#000', margin: '0 0 32px 0', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                        How CivilConnect Works
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {[
                            { step: '01', title: 'Choose Category', desc: 'Select from verified contractors, engineers or direct labor', icon: <Search size={22} className="text-[#7C3AED]" /> },
                            { step: '02', title: 'Check Expert Detail', desc: 'Review portfolios, ratings and verify experience level', icon: <ClipboardList size={22} className="text-[#3B82F6]" /> },
                            { step: '03', title: 'Hire Instantly', desc: 'Send service requests and start your work today', icon: <CheckCircle size={22} className="text-[#10B981]" /> }
                        ].map((item, i) => (
                            <div key={i} className="work-step-animate" style={{ display: 'flex', gap: 20, position: 'relative', animation: `fadeInUp 0.6s ease-out ${i * 0.2}s both` }}>
                                {i < 2 && <div style={{ position: 'absolute', left: '22px', top: '50px', bottom: '-26px', width: '2px', background: 'linear-gradient(#7C3AED33, transparent)' }} />}
                                <div style={{
                                    width: '46px', height: '46px', borderRadius: '14px', background: i === 2 ? '#DCFCE7' : '#F5F3FF',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0,
                                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.08)', zIndex: 1
                                }}>
                                    {item.icon}
                                </div>
                                <div>
                                    <div style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '8px', background: i === 2 ? '#DCFCE7' : '#EFF6FF', color: i === 2 ? '#166534' : '#3B82F6', fontSize: '12px', fontWeight: '900', marginBottom: 8, textTransform: 'uppercase' }}>
                                        Step {item.step}
                                    </div>
                                    <h4 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: '900', color: '#1F2937', margin: '0 0 6px 0' }}>{item.title}</h4>
                                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#6B7280', margin: 0, lineHeight: 1.6, maxWidth: '240px', fontWeight: '500' }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                
                .category-card-hover:hover {
                    animation: jiggle 0.4s ease-in-out;
                    box-shadow: 0 10px 20px rgba(124, 58, 237, 0.15) !important;
                    border-color: rgba(124, 58, 237, 0.2) !important;
                }

                .provider-card-hover:hover {
                    animation: jiggle 0.4s ease-in-out;
                    transform: translateY(-4px);
                    box-shadow: 0 12px 24px rgba(124, 58, 237, 0.1) !important;
                }

                @keyframes jiggle {
                    0% { transform: scale(1); }
                    25% { transform: scale(1.05) rotate(-2deg); }
                    50% { transform: scale(1.05) rotate(2deg); }
                    75% { transform: scale(1.05) rotate(-1deg); }
                    100% { transform: scale(1); }
                }

                .category-card-hover:active { transform: scale(0.9); }
            `}</style>
        </div>
    );
};

export default Home;
