import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockCategories } from '../mockData';

const Categories = () => {
    const navigate = useNavigate();
    const [search, setSearch] = React.useState('');

    const filteredCategories = mockCategories.filter(cat =>
        cat.label.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ paddingBottom: 20 }}>
            {/* Elegant Header */}
            <header style={{
                padding: '16px 20px 24px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                borderRadius: '0 0 32px 32px',
                boxShadow: '0 10px 30px rgba(124, 58, 237, 0.2)',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: '24px', fontWeight: '800', color: '#fff', margin: '0 0 6px 0' }}>
                    All Categories
                </h1>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: 'rgba(255,255,255,0.8)', margin: '0 0 20px 0' }}>
                    Select a service to find verified professionals
                </p>

                {/* Search Bar */}
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
                        placeholder="Search contractors, engineers..."
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

            {/* Service Grid */}
            <div style={{
                padding: '24px 20px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
            }}>
                {filteredCategories.map((cat, i) => (
                    <div
                        key={cat.id}
                        onClick={() => navigate(`/user/categories/${cat.id}`)}
                        className="cat-card-animated"
                        style={{
                            background: '#fff',
                            borderRadius: '24px',
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            gap: 12,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
                            border: '1.5px solid #F3F4FB',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            animation: `fadeInUp 0.6s ease-out ${i * 0.1}s both`
                        }}
                    >
                        <div style={{
                            width: '60px',
                            height: '60px',
                            background: '#F5F3FF',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '30px',
                            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.08)',
                            border: '1.5px solid #fff'
                        }}>
                            {cat.icon}
                        </div>
                        <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: '800', color: '#1F2937', margin: 0 }}>
                            {cat.label}
                        </h3>
                    </div>
                ))}
            </div>
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .cat-card-animated:active { transform: scale(0.94) rotate(-1deg); }
            `}</style>
        </div>
    );
};

export default Categories;
