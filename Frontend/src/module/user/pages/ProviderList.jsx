import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockProviders, mockCategories } from '../mockData';

const ProviderList = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const category = mockCategories.find(c => c.id === categoryId);

    const [filter, setFilter] = useState('all'); // all, available, busy
    const [sortBy, setSortBy] = useState('exp'); // exp, price

    const providers = mockProviders
        .filter(p => p.categoryId === categoryId)
        .filter(p => filter === 'all' || p.availability === filter)
        .sort((a, b) => {
            if (sortBy === 'exp') return b.experience - a.experience;
            const priceA = parseInt(a.pricing.replace(/[^0-9]/g, ''));
            const priceB = parseInt(b.pricing.replace(/[^0-9]/g, ''));
            return priceA - priceB;
        });

    return (
        <div style={{ paddingBottom: 20 }}>
            {/* Context Header */}
            <header style={{
                padding: '16px 20px 24px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                borderRadius: '0 0 32px 32px',
                boxShadow: '0 10px 30px rgba(124, 58, 237, 0.2)',
                position: 'sticky',
                top: 0,
                zIndex: 50
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <button
                        onClick={() => navigate('/user/categories')}
                        style={{ background: 'rgba(255,255,255,0.15)', border: 'none', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(10px)' }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                    </button>
                    <div>
                        <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: '20px', fontWeight: '800', color: '#fff', margin: 0 }}>
                            {category?.label}s
                        </h1>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                            {providers.length} verified experts found
                        </p>
                    </div>
                </div>

                {/* Filters & Sorting */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }} className="hide-scrollbar">
                        {['all', 'available', 'busy'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: filter === f ? '#7C3AED' : '#F5F3FF',
                                    color: filter === f ? '#fff' : '#4B5563',
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    textTransform: 'capitalize',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {f}
                            </button>
                        ))}
                        <div style={{ width: '1px', background: '#E5E7EB', margin: '4px 4px' }} />
                        {['exp', 'price'].map(s => (
                            <button
                                key={s}
                                onClick={() => setSortBy(s)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: sortBy === s ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
                                    color: sortBy === s ? '#7C3AED' : '#9CA3AF',
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                Sort by {s === 'exp' ? 'Experience' : 'Price'}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Provider Cards */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {providers.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#9CA3AF' }}>
                        No experts found in this category.
                    </div>
                ) : (
                    providers.map((p, i) => (
                        <div
                            key={p.id}
                            onClick={() => navigate(`/user/provider/${p.id}`)}
                            className="provider-card-animate"
                            style={{
                                background: '#fff',
                                borderRadius: '24px',
                                padding: '16px',
                                boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
                                border: '1px solid #F3F4FB',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 14,
                                position: 'relative',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                animation: `fadeInScale 0.5s ease-out ${i * 0.1}s both`
                            }}
                        >
                            {/* Availability Pill */}
                            <div style={{
                                position: 'absolute',
                                top: 16,
                                right: 16,
                                padding: '4px 10px',
                                borderRadius: '8px',
                                background: p.availability === 'available' ? '#DCFCE7' : '#FFF1F2',
                                color: p.availability === 'available' ? '#166534' : '#E11D48',
                                fontSize: '10px',
                                fontWeight: '900',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>
                                {p.availability}
                            </div>

                            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                                {/* Avatar */}
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '18px',
                                    background: '#F5F3FF',
                                    flexShrink: 0,
                                    overflow: 'hidden',
                                    border: '1px solid #F3F4F6'
                                }}>
                                    {p.avatar ? (
                                        <img src={p.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
                                            {category?.icon}
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px', fontWeight: '800', color: '#111827', margin: '0 0 2px 0' }}>
                                        {p.name}
                                    </h3>
                                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#6B7280', margin: '0 0 6px 0', fontWeight: '500' }}>
                                        {p.role}
                                    </p>
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <span style={{ fontSize: '12px' }}>⭐</span>
                                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: '800', color: '#374151' }}>{p.rating || '4.5'}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <span style={{ fontSize: '12px' }}>💼</span>
                                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: '700', color: '#6B7280' }}>{p.experience}y Exp</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Skills and Price */}
                            <div style={{
                                paddingTop: 12,
                                borderTop: '1px solid #F9FAFB',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <div style={{ display: 'flex', gap: 6 }}>
                                    {p.skills.slice(0, 2).map(skill => (
                                        <span key={skill} style={{
                                            padding: '4px 10px',
                                            borderRadius: '8px',
                                            background: '#F5F3FF',
                                            fontSize: '11px',
                                            color: '#7C3AED',
                                            fontWeight: '700'
                                        }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: '900', color: '#111827' }}>
                                        {p.pricing.split('/')[0]}
                                    </span>
                                    <span style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: '700' }}>
                                        /{p.pricing.split('/')[1] || 'day'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .provider-card-animate:active { transform: scale(0.97); }
            `}</style>
        </div>
    );
};

export default ProviderList;
