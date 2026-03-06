import React, { useState } from 'react';
import { mockMaterials } from '../mockData';

const MaterialCategories = ['All', 'Basic', 'Steel', 'Masonry', 'Flooring', 'Plumbing', 'Electrical', 'Finishing', 'Wood'];

const Materials = () => {
    const [search, setSearch] = useState('');
    const [activeCat, setActiveCat] = useState('All');

    const filtered = mockMaterials.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
        const matchesCat = activeCat === 'All' || m.category === activeCat;
        return matchesSearch && matchesCat;
    });

    return (
        <div style={{ paddingBottom: 20 }}>
            {/* Header / Search Area */}
            <header style={{
                padding: '16px 20px 24px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                borderRadius: '0 0 32px 32px',
                boxShadow: '0 10px 30px rgba(124, 58, 237, 0.2)',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: '24px', fontWeight: '800', color: '#fff', margin: '0 0 4px 0' }}>
                    Material Prices
                </h1>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: 'rgba(255,255,255,0.8)', margin: '0 0 20px 0' }}>
                    Daily updated reference rates in your city
                </p>

                {/* Search Input */}
                <div style={{
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search materials (e.g. Cement, Steel)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            border: 'none', background: 'transparent', width: '100%',
                            fontFamily: "'Inter', sans-serif", fontSize: '14px', outline: 'none',
                            color: '#1F2937'
                        }}
                    />
                </div>
            </header>

            {/* Reference Note Banner */}
            <div style={{ padding: '16px 20px 0' }} className="fade-in-slide">
                <div style={{
                    background: 'linear-gradient(90deg, #FFFBEB 0%, #FEF9C3 100%)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    border: '1px solid rgba(133, 77, 14, 0.1)',
                    boxShadow: '0 4px 12px rgba(133, 77, 14, 0.04)'
                }}>
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '10px', background: '#FEF08A',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0
                    }}>
                        💡
                    </div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#854D0E', margin: 0, lineHeight: 1.5, fontWeight: '500' }}>
                        <b style={{ fontWeight: '900', color: '#713F12' }}>Reference Only:</b> Market prices fluctuated daily. Direct ordering is currently disabled.
                    </p>
                </div>
            </div>

            {/* Category Filter Chips */}
            <div style={{
                padding: '20px 0 8px',
                display: 'flex',
                gap: 8,
                overflowX: 'auto',
                scrollbarWidth: 'none',
                paddingLeft: 20,
                paddingRight: 20
            }} className="hide-scrollbar">
                {MaterialCategories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCat(cat)}
                        style={{
                            padding: '10px 18px',
                            borderRadius: '12px',
                            border: '1px solid',
                            borderColor: activeCat === cat ? '#7C3AED' : '#F3F4F6',
                            background: activeCat === cat ? '#7C3AED' : '#fff',
                            color: activeCat === cat ? '#fff' : '#4B5563',
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '14px',
                            fontWeight: '800',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            boxShadow: activeCat === cat ? '0 8px 16px rgba(124, 58, 237, 0.2)' : 'none',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Materials Grid */}
            <div style={{
                padding: '16px 20px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px'
            }}>
                {filtered.map(m => (
                    <div key={m.id} style={{
                        background: '#fff',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                        border: '1px solid #F3F4F6',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '240px'
                    }}>
                        <div style={{ height: '110px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                            <img src={m.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={m.name} />
                            <div style={{
                                position: 'absolute', top: '8px', right: '8px',
                                background: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: '6px',
                                fontSize: '10px', fontWeight: '800', color: '#7C3AED', backdropFilter: 'blur(4px)'
                            }}>
                                {m.category}
                            </div>
                        </div>
                        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                            <div>
                                <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: '800', color: '#111827', margin: '0 0 6px 0', lineHeight: 1.4, height: '42px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                    {m.name}
                                </h3>
                            </div>
                            <div style={{ paddingTop: 8, borderTop: '1px solid #F9FAFB' }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px', fontWeight: '900', color: '#7C3AED' }}>
                                        {m.price}
                                    </span>
                                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#64748B', fontWeight: '600' }}>
                                        {m.unit}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9CA3AF' }}>
                    <p style={{ fontSize: '40px', marginBottom: 12 }}>🧱</p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>No materials found for "{search}"</p>
                </div>
            )}

            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                
                @keyframes slideIn {
                    from { transform: translateY(10px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .fade-in-slide { animation: slideIn 0.5s ease-out; }
            `}</style>
        </div>
    );
};

export default Materials;
