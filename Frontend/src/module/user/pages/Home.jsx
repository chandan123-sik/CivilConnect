import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ClipboardList, CheckCircle } from 'lucide-react';
import { mockCategories, mockProviders, mockMaterials } from '../mockData';

const Home = () => {
    const navigate = useNavigate();
    const [userName] = useState(localStorage.getItem('user_name') || 'Guest');
    const [userCity] = useState(localStorage.getItem('user_city') || 'Pune');
    const [profileImg] = useState(localStorage.getItem('user_profile_image'));

    const bannerRef = React.useRef(null);
    const [currentBanner, setCurrentBanner] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [userNotifications, setUserNotifications] = useState([]);

    const loadNotifications = () => {
        const orders = JSON.parse(localStorage.getItem('cc_material_orders') || '[]');
        // Only show updates for accepted/rejected orders
        const updates = orders.filter(o => o.status !== 'pending').map(o => ({
            id: o.id,
            status: o.status,
            brand: o.brand.name || o.brand,
            deliveryTime: o.deliveryTime || 'N/A',
            createdAt: o.createdAt
        }));
        setUserNotifications(updates.reverse());
    };

    useEffect(() => {
        loadNotifications();
        const handleStorage = () => loadNotifications();
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const banners = React.useMemo(() => {
        const saved = localStorage.getItem('cc_home_banners');
        if (saved) return JSON.parse(saved);
        return [
            { title: 'Premium Construction Materials', desc: 'Get daily updated rates for cement, steel and more.', img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80' },
            { title: 'Verified Expert Manpower', desc: 'Directly connect with top-rated contractors & engineers.', img: 'https://images.unsplash.com/photo-1503387762-592dea58ef21?w=800&q=80' },
            { title: 'Secure & Direct Connection', desc: 'Connect directly with experts without middlemen.', img: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80' }
        ];
    }, []);

    React.useEffect(() => {
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
        }, 4000); // Increased to 4s for better readability
        return () => clearInterval(interval);
    }, [currentBanner, banners.length]);

    const handleScroll = (e) => {
        const scrollLeft = e.target.scrollLeft;
        const cardWidth = window.innerWidth - 28;
        const gap = 28;
        const index = Math.round(scrollLeft / (cardWidth + gap));
        if (index !== currentBanner && index >= 0 && index < banners.length) {
            setCurrentBanner(index);
        }
    };

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
                            {userName}
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
                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: '700', color: '#fff' }}>{userCity}</span>
                        </div>

                        {/* Notification Bell */}
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                style={{
                                    width: '38px', height: '38px', borderRadius: '12px',
                                    background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                    transition: 'all 0.2s', position: 'relative', backdropFilter: 'blur(10px)'
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" /></svg>
                                {userNotifications.length > 0 && <span style={{ position: 'absolute', top: '8px', right: '8px', width: '7px', height: '7px', background: '#EF4444', borderRadius: '50%', border: '1.5px solid #7C3AED', boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)' }} />}
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
                                        position: 'fixed', top: 0, right: 0,
                                        width: '85%', maxWidth: '340px', height: '100vh',
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
                                                    <div key={notif.id} style={{ padding: '16px', borderRadius: '20px', background: notif.status === 'accepted' ? '#F0FDF4' : '#FEF2F2', border: '1px solid', borderColor: notif.status === 'accepted' ? '#DCFCE7' : '#FEE2E2', position: 'relative' }}>
                                                        <div style={{ display: 'flex', gap: 12 }}>
                                                            <div style={{
                                                                width: '10px', height: '10px', borderRadius: '50%',
                                                                background: notif.status === 'accepted' ? '#10B981' : '#EF4444',
                                                                marginTop: '4px'
                                                            }} />
                                                            <div>
                                                                <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '800', color: notif.status === 'accepted' ? '#166534' : '#991B1B' }}>
                                                                    {notif.status === 'accepted' ? 'Order Confirmed' : 'Order Rejected'}
                                                                </p>
                                                                <p style={{ margin: 0, fontSize: '11px', fontWeight: '600', color: notif.status === 'accepted' ? '#15803D' : '#B91C1C', lineHeight: 1.5 }}>
                                                                    {notif.brand}: {notif.status === 'accepted' ? `Your material is arriving in ${notif.deliveryTime}.` : 'The order was declined by admin.'}
                                                                </p>
                                                                <p style={{ margin: '8px 0 0', fontSize: '9px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' }}>
                                                                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        <div style={{ padding: '20px', background: '#F8FAFC', borderTop: '1px solid #F1F5F9' }}>
                                            <button
                                                onClick={() => { setShowNotifications(false); navigate('/user/materials'); }}
                                                style={{ width: '100%', padding: '14px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)', color: '#fff', fontSize: '13px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)' }}
                                            >
                                                VIEW ALL ORDERS
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header >

            {/* Horizontal Promo Banners */}
            < div style={{ position: 'relative', marginBottom: 0 }}>
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
                            minWidth: 'calc(100vw - 28px)',
                            width: 'calc(100vw - 28px)',
                            height: '160px',
                            background: `linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 70%), url("${item.img}")`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '20px',
                            padding: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                            scrollSnapAlign: 'start',
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}>
                            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '22px', fontWeight: '900', color: '#fff', margin: '0 0 6px 0', lineHeight: 1.2, textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                                {item.title}
                            </h3>
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#fff', margin: 0, maxWidth: '280px', fontWeight: '500', textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
                                {item.desc}
                            </p>
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
            </div >

            {/* Horizontal Categories Scroll */}
            < section style={{ padding: '0 0 0' }}>
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
                    {mockCategories.map(cat => (
                        <div
                            key={cat.id}
                            onClick={() => navigate(`/user/categories/${cat.id}`)}
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
                                {cat.icon}
                            </div>
                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: '800', color: '#1F2937', textAlign: 'center', width: '74px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {cat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </section >

            {/* Popular Providers Horizontal Scroll */}
            < section style={{ padding: '0 0 20px' }}>
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
                    {mockProviders.slice(0, 5).map(provider => (
                        <div
                            key={provider.id}
                            onClick={() => navigate(`/user/provider/${provider.id}`)}
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
                                textAlign: 'center'
                            }}
                        >
                            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#F3F4F6', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', overflow: 'hidden' }}>
                                {provider.avatar ? <img src={provider.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" decoding="async" alt={provider.name} /> : provider.categoryId === 'contractor' ? '🏗️' : '👤'}
                            </div>
                            <h4 style={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: '800', color: '#1F2937', margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {provider.name}
                            </h4>
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#6B7280', margin: '0 0 12px 0', fontWeight: '500' }}>{provider.role}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span style={{ fontSize: '14px' }}>⭐</span>
                                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: '800', color: '#1F2937' }}>{provider.rating || '4.5'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section >

            {/* Popular Materials Horizontal Scroll */}
            < section style={{ padding: '0 0 20px' }}>
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
                    {mockMaterials.slice(0, 4).map(m => (
                        <div
                            key={m.id}
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
                                <img src={m.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" decoding="async" alt={m.name} />
                            </div>
                            <div style={{ padding: '12px' }}>
                                <div style={{ fontSize: '10px', color: '#7C3AED', fontWeight: '800', textTransform: 'uppercase', marginBottom: 4, letterSpacing: '0.02em' }}>
                                    {m.category}
                                </div>
                                <h4 style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: '800', color: '#1F2937', margin: '0 0 4px 0', lineClamp: 1, overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 1 }}>
                                    {m.name}
                                </h4>
                                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#10B981', margin: 0, fontWeight: '900' }}>
                                    {m.price} <span style={{ color: '#6B7280', fontSize: '10px', fontWeight: '600' }}>{m.unit}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section >

            {/* How It Works Section */}
            < section style={{ padding: '10px 16px 20px' }}>
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
            </section >
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
        </div >
    );
};

export default Home;
