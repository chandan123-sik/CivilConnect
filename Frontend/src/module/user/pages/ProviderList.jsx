import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProviders, getCategories } from '../../../api/publicApi';

const ProviderList = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();

    const [category, setCategory] = useState(null);
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [subCategoryId, setSubCategoryId] = useState('all');
    const [selectedCity, setSelectedCity] = useState('All Cities');
    const [showCitySheet, setShowCitySheet] = useState(false);
    const [showCategorySheet, setShowCategorySheet] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch categories to find current one
                const cats = await getCategories();
                const foundCat = cats.find(c => c._id === categoryId);
                setCategory(foundCat);

                // Fetch providers
                const params = { categoryId };
                if (selectedCity !== 'All Cities') params.city = selectedCity;
                if (subCategoryId !== 'all') params.subCategory = subCategoryId;
                
                const res = await getProviders(params);
                setProviders(res);
            } catch (err) {
                console.error("Provider fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [categoryId, selectedCity, subCategoryId]);

    const cities = ['All Cities', 'Pune', 'Mumbai', 'Nagpur', 'Nashik', 'Indore', 'Delhi', 'Bangalore'];

    const currentSubLabel = subCategoryId === 'all'
        ? `All ${category?.label}s`
        : subCategoryId;

    return (
        <div style={{ paddingBottom: 80 }}>
            {/* Context Header */}
            <header style={{
                padding: '20px 20px 20px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                borderRadius: '0 0 32px 32px',
                boxShadow: '0 10px 30px rgba(124, 58, 237, 0.2)',
                position: 'sticky',
                top: 0,
                zIndex: 50
            }}>
                {/* Top Row: Back + Title + Filter Icons */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button
                            onClick={() => navigate('/user/categories')}
                            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', width: '38px', height: '38px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                        </button>
                        <div>
                            <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: '900', color: '#fff', margin: 0, letterSpacing: '-0.3px' }}>
                                {category?.label}s
                            </h1>
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', color: 'rgba(255,255,255,0.7)', margin: 0, fontWeight: '700', textTransform: 'uppercase' }}>
                                {providers.length} Expert{providers.length !== 1 ? 's' : ''} Found
                            </p>
                        </div>
                    </div>
                    {/* Filter Icon Buttons */}
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button
                            onClick={() => { setShowCitySheet(true); setShowCategorySheet(false); }}
                            style={{
                                height: '38px', borderRadius: '12px', background: selectedCity !== 'All Cities' ? '#fff' : 'rgba(255,255,255,0.15)', border: 'none',
                                color: selectedCity !== 'All Cities' ? '#7C3AED' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                padding: '0 12px', gap: 5, transition: 'all 0.3s'
                            }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                            <span style={{ fontSize: '11px', fontWeight: '900' }}>{selectedCity}</span>
                        </button>
                        <button
                            onClick={() => { setShowCategorySheet(true); setShowCitySheet(false); }}
                            style={{
                                height: '38px', borderRadius: '12px', background: subCategoryId !== 'all' ? '#fff' : 'rgba(255,255,255,0.15)', border: 'none',
                                color: subCategoryId !== 'all' ? '#7C3AED' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                padding: '0 12px', gap: 5, transition: 'all 0.3s'
                            }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="2" y1="14" x2="6" y2="14" /><line x1="10" y1="8" x2="14" y2="8" /><line x1="18" y1="16" x2="22" y2="16" /></svg>
                            <span style={{ fontSize: '11px', fontWeight: '900' }}>Filter</span>
                        </button>
                    </div>
                </div>

                {/* Availability Tabs */}
                <div style={{ display: 'flex', gap: 8 }}>
                    {['ALL', 'AVAILABLE', 'BUSY'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f.toLowerCase())}
                            style={{
                                padding: '8px 18px', borderRadius: '14px', border: 'none',
                                background: filter === f.toLowerCase() ? '#fff' : 'rgba(255,255,255,0.1)',
                                color: filter === f.toLowerCase() ? '#7C3AED' : '#fff',
                                fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: '900',
                                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.3s'
                            }}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </header>

            {/* Provider Cards */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                        Loading experts...
                    </div>
                ) : providers.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9CA3AF' }}>
                        <div style={{ fontSize: '48px', marginBottom: 16 }}>🔍</div>
                        <p style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 8px', color: '#374151' }}>No experts found</p>
                        <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0 }}>
                            Try selecting "All Cities" or changing filters
                        </p>
                    </div>
                ) : (
                    providers.map((p, i) => (
                        <div
                            key={p._id}
                            onClick={() => navigate(`/user/provider/${p._id}`)}
                            style={{
                                background: '#fff',
                                borderRadius: '24px',
                                padding: '16px',
                                boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
                                border: '1px solid #F3F4FB',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 14,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                animation: `fadeInScale 0.5s ease-out ${i * 0.08}s both`
                            }}
                        >
                            {/* Top Row */}
                            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: '#F5F3FF', flexShrink: 0, overflow: 'hidden', border: '1px solid #EDE9FE' }}>
                                    {p.profileImage ? (
                                        <img src={p.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>{category?.icon || '👤'}</div>
                                    )}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                                        <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: '800', color: '#111827', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {p.fullName}
                                        </h3>
                                        <span style={{
                                            padding: '3px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', flexShrink: 0, marginLeft: 8,
                                            background: p.isOnline ? '#DCFCE7' : '#FFF1F2',
                                            color: p.isOnline ? '#166534' : '#E11D48',
                                        }}>{p.isOnline ? 'Online' : 'Busy'}</span>
                                    </div>
                                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#6B7280', margin: '0 0 6px 0', fontWeight: '500' }}>{p.category}</p>
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#374151' }}>⭐ {p.rating || '4.5'}</span>
                                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280' }}>💼 {p.experience}y Exp</span>
                                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280' }}>📍 {p.city}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Skills and Price */}
                            <div style={{ paddingTop: 12, borderTop: '1px solid #F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                    {(p.specialities || []).slice(0, 2).map(skill => (
                                        <span key={skill} style={{ padding: '4px 10px', borderRadius: '8px', background: '#F5F3FF', fontSize: '11px', color: '#7C3AED', fontWeight: '700' }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 8 }}>
                                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px', fontWeight: '900', color: '#111827' }}>
                                        ₹{p.pricing}
                                    </span>
                                    <span style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: '700' }}>
                                        /day
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* ── CITY BOTTOM SHEET ── */}
            {showCitySheet && (
                <>
                    <div
                        onClick={() => setShowCitySheet(false)}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 2000 }}
                    />
                    <div style={{
                        position: 'fixed', bottom: 0, left: 0, right: 0,
                        background: '#fff', borderRadius: '28px 28px 0 0',
                        padding: '24px 20px 40px', zIndex: 3000,
                        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        boxShadow: '0 -20px 60px rgba(0,0,0,0.15)'
                    }}>
                        <div style={{ width: '40px', height: '4px', background: '#E5E7EB', borderRadius: '2px', margin: '0 auto 20px' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: '#111827' }}>Select City</h3>
                            <button onClick={() => setShowCitySheet(false)} style={{ border: 'none', background: '#F3F4F6', width: '32px', height: '32px', borderRadius: '10px', cursor: 'pointer', color: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>✕</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {cities.map(city => (
                                <button
                                    key={city}
                                    onClick={() => { setSelectedCity(city); setShowCitySheet(false); }}
                                    style={{
                                        padding: '14px 18px', borderRadius: '16px', border: '2px solid',
                                        borderColor: selectedCity === city ? '#7C3AED' : '#F3F4F6',
                                        background: selectedCity === city ? '#F5F3FF' : '#fff',
                                        color: selectedCity === city ? '#7C3AED' : '#374151',
                                        fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: '700',
                                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                                        display: 'flex', alignItems: 'center', gap: 10
                                    }}
                                >
                                    <span>{city === 'All Cities' ? '🌍' : '📍'}</span>
                                    {city}
                                    {selectedCity === city && <span style={{ marginLeft: 'auto', color: '#7C3AED' }}>✓</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* ── SUB-CATEGORY BOTTOM SHEET ── */}
            {showCategorySheet && (
                <>
                    <div
                        onClick={() => setShowCategorySheet(false)}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 2000 }}
                    />
                    <div style={{
                        position: 'fixed', bottom: 0, left: 0, right: 0,
                        background: '#fff', borderRadius: '28px 28px 0 0',
                        padding: '24px 20px 40px', zIndex: 3000,
                        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        boxShadow: '0 -20px 60px rgba(0,0,0,0.15)'
                    }}>
                        <div style={{ width: '40px', height: '4px', background: '#E5E7EB', borderRadius: '2px', margin: '0 auto 20px' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: '#111827' }}>Filter by Type</h3>
                            <button onClick={() => setShowCategorySheet(false)} style={{ border: 'none', background: '#F3F4F6', width: '32px', height: '32px', borderRadius: '10px', cursor: 'pointer', color: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>✕</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <button
                                onClick={() => { setSubCategoryId('all'); setShowCategorySheet(false); }}
                                style={{
                                    padding: '14px 18px', borderRadius: '16px', border: '2px solid',
                                    borderColor: subCategoryId === 'all' ? '#7C3AED' : '#F3F4F6',
                                    background: subCategoryId === 'all' ? '#F5F3FF' : '#fff',
                                    color: subCategoryId === 'all' ? '#7C3AED' : '#374151',
                                    fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: '700',
                                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                                    display: 'flex', alignItems: 'center', gap: 10
                                }}
                            >
                                <span>{category?.icon || '🛠️'}</span>
                                All {category?.label}s
                                {subCategoryId === 'all' && <span style={{ marginLeft: 'auto', color: '#7C3AED' }}>✓</span>}
                            </button>
                            {(() => {
                                const subCats = category?.subCategories || [];
                                // Safety: If the array contains a stringified array like '["A","B"]', flatten it.
                                const flattened = subCats.flatMap(sub => {
                                    try {
                                        if (typeof sub === 'string' && sub.startsWith('[') && sub.endsWith(']')) {
                                            return JSON.parse(sub);
                                        }
                                        return sub;
                                    } catch (e) { return sub; }
                                });
                                return flattened.map(sub => (
                                    <button
                                        key={sub}
                                        onClick={() => { setSubCategoryId(sub); setShowCategorySheet(false); }}
                                        style={{
                                            padding: '14px 18px', borderRadius: '16px', border: '2px solid',
                                            borderColor: subCategoryId === sub ? '#7C3AED' : '#F3F4F6',
                                            background: subCategoryId === sub ? '#F5F3FF' : '#fff',
                                            color: subCategoryId === sub ? '#7C3AED' : '#374151',
                                            fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: '700',
                                            cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                                            display: 'flex', alignItems: 'center', gap: 10
                                        }}
                                    >
                                        <span>🔧</span>
                                        {sub}
                                        {subCategoryId === sub && <span style={{ marginLeft: 'auto', color: '#7C3AED' }}>✓</span>}
                                    </button>
                                ));
                            })()}
                        </div>
                    </div>
                </>
            )}

            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.96) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .fade-in-slide {
                    animation: fadeInScale 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default ProviderList;
