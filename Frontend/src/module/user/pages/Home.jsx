import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockCategories, mockProviders } from '../mockData';

const Home = () => {
    const navigate = useNavigate();
    const [userName] = useState(localStorage.getItem('user_name') || 'Guest');
    const [userCity] = useState(localStorage.getItem('user_city') || 'Pune');
    const [profileImg] = useState(localStorage.getItem('user_profile_image'));

    const bannerRef = React.useRef(null);
    const [currentBanner, setCurrentBanner] = useState(0);

    const banners = [
        { title: 'Premium Construction Materials', desc: 'Get daily updated rates for cement, steel and more.', img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80' },
        { title: 'Verified Expert Manpower', desc: 'Directly connect with top-rated contractors & engineers.', img: 'https://images.unsplash.com/photo-1503387762-592dea58ef21?w=800&q=80' },
        { title: 'Secure & Direct Connection', desc: 'Connect directly with experts without middlemen.', img: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80' }
    ];

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (bannerRef.current) {
                const next = (currentBanner + 1) % banners.length;
                const cardWidth = window.innerWidth - 28;
                const gap = 28;
                bannerRef.current.scrollTo({
                    left: next * (cardWidth + gap),
                    behavior: 'smooth'
                });
                setCurrentBanner(next);
            }
        }, 3000);
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
                padding: '16px 20px 12px',
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
                    <div>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: 'rgba(255,255,255,0.8)', margin: '0 0 4px 0', fontWeight: '600', display: 'flex', alignItems: 'center', gap: 6 }}>
                            Good day, <span style={{ fontSize: '18px' }}>👋</span>
                        </p>
                        <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: '24px', fontWeight: '900', color: '#fff', margin: 0 }}>
                            {userName}
                        </h1>
                    </div>
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
                </div>
            </header>

            {/* Horizontal Promo Banners */}
            <div style={{ position: 'relative', marginBottom: 20 }}>
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
            </div>

            {/* Horizontal Categories Scroll */}
            <section style={{ padding: '20px 0 0' }}>
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
                    msOverflowStyle: 'none'
                }} className="hide-scrollbar">
                    {mockCategories.map(cat => (
                        <div
                            key={cat.id}
                            onClick={() => navigate(`/user/categories/${cat.id}`)}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', flexShrink: 0 }}
                        >
                            <div style={{
                                width: '68px',
                                height: '68px',
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
                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: '600', color: '#4B5563', textAlign: 'center', width: '68px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {cat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Popular Providers Horizontal Scroll */}
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
                    {mockProviders.slice(0, 5).map(provider => (
                        <div
                            key={provider.id}
                            onClick={() => navigate(`/user/provider/${provider.id}`)}
                            style={{
                                minWidth: '150px',
                                background: '#fff',
                                borderRadius: '16px',
                                padding: '14px',
                                boxShadow: '0 6px 15px rgba(124, 58, 237, 0.06)',
                                border: '1px solid rgba(124, 58, 237, 0.04)',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#F5F3FF', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', overflow: 'hidden' }}>
                                {provider.avatar ? <img src={provider.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : provider.categoryId === 'contractor' ? '🏗️' : '👤'}
                            </div>
                            <h4 style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: '700', color: '#1F2937', margin: '0 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {provider.name}
                            </h4>
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#6B7280', margin: '0 0 10px 0' }}>{provider.role}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span style={{ fontSize: '12px' }}>⭐</span>
                                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: '700', color: '#1F2937' }}>{provider.rating || '4.5'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

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
                            { step: '01', title: 'Choose Category', desc: 'Select from verified contractors, engineers or direct labor', icon: '🔍' },
                            { step: '02', title: 'Check Expert Detail', desc: 'Review portfolios, ratings and verify experience level', icon: '📋' },
                            { step: '03', title: 'Hire Instantly', desc: 'Send service requests and start your work today', icon: '✅' }
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
                                    <div style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '6px', background: i === 2 ? '#DCFCE7' : '#EFF6FF', color: i === 2 ? '#166534' : '#3B82F6', fontSize: '10px', fontWeight: '800', marginBottom: 6, textTransform: 'uppercase' }}>
                                        Step {item.step}
                                    </div>
                                    <h4 style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px', fontWeight: '800', color: '#1F2937', margin: '0 0 4px 0' }}>{item.title}</h4>
                                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#6B7280', margin: 0, lineHeight: 1.5, maxWidth: '240px' }}>{item.desc}</p>
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
