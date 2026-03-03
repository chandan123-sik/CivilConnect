import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const [clientName, setClientName] = useState(localStorage.getItem('client_name') || 'Guest User');
    const [clientCity, setClientCity] = useState(localStorage.getItem('client_city') || 'Pune');
    const [showEdit, setShowEdit] = useState(false);
    const [showPolicy, setShowPolicy] = useState(false);
    const [showRate, setShowRate] = useState(false);
    const [rating, setRating] = useState(0);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        localStorage.setItem('client_name', clientName);
        localStorage.setItem('client_city', clientCity);
        setShowEdit(false);
    };

    // Dummy sent requests
    const sentRequests = [
        { id: 1, provider: 'Mr. Rajesh Kumar', role: 'Civil Contractor', date: '02 Mar 2026', status: 'Pending', price: '₹1,500/day' },
        { id: 2, provider: 'Amit Sharma', role: 'Plumber', date: '28 Feb 2026', status: 'Accepted', price: '₹600/visit' },
    ];

    return (
        <div style={{ paddingBottom: 80, background: '#F9FAFB' }}>
            {/* Context Header */}
            <header style={{
                padding: '16px 20px 24px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                borderRadius: '0 0 32px 32px',
                boxShadow: '0 10px 30px rgba(124, 58, 237, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: '20px', fontWeight: '900', color: '#fff', margin: 0 }}>
                    Profile Settings
                </h1>
            </header>

            {/* User Profile Card */}
            <div style={{ padding: '16px 12px 0', animation: 'fadeInUp 0.6s ease-out both' }}>
                <div style={{
                    background: '#fff',
                    borderRadius: '20px',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
                    border: '1.5px solid #E2E8F0',
                    position: 'relative'
                }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '16px',
                        background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '30px', flexShrink: 0
                    }}>
                        👤
                    </div>
                    <div style={{ flex: 1 }}>
                        <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '19px', fontWeight: '800', color: '#111827', margin: '0 0 4px 0' }}>
                            {clientName}
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: '12px' }}>📍</span>
                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#6B7280', fontWeight: '500' }}>
                                {clientCity}, India
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowEdit(true)}
                        className="pulse-btn"
                        style={{ border: 'none', background: '#F5F3FF', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                        <span style={{ fontSize: '16px' }}>✏️</span>
                    </button>
                </div>
            </div>

            {/* My Service Requests */}
            <section style={{ padding: '16px 20px 0', animation: 'fadeInUp 0.6s ease-out 0.2s both' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '17px', fontWeight: '800', color: '#1F2937', margin: 0 }}>
                        Service Requests
                    </h2>
                    <span
                        onClick={() => navigate('/user/requests')}
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#7C3AED', fontWeight: '700', cursor: 'pointer' }}
                    >
                        See All
                    </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {sentRequests.map(req => (
                        <div key={req.id} style={{
                            background: '#fff',
                            borderRadius: '16px',
                            padding: '16px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                            border: '1.5px solid #F1F5F9',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                                    🏗️
                                </div>
                                <div>
                                    <h4 style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: '700', color: '#111827', margin: '0 0 2px 0' }}>{req.provider}</h4>
                                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#6B7280', margin: 0 }}>{req.date} · {req.role}</p>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{
                                    display: 'inline-block', padding: '3px 8px', borderRadius: '6px',
                                    background: req.status === 'Accepted' ? '#DCFCE7' : '#FEF9C3',
                                    color: req.status === 'Accepted' ? '#166534' : '#854D0E',
                                    fontSize: '10px', fontWeight: '800', marginBottom: 4
                                }}>
                                    {req.status.toUpperCase()}
                                </span>
                                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: '800', color: '#111827', margin: 0 }}>{req.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Support & Settings */}
            <section style={{ padding: '16px 20px 0', animation: 'fadeInUp 0.6s ease-out 0.4s both' }}>
                <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: '900', color: '#9CA3AF', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Preference & Support
                </h2>
                <div style={{ background: '#fff', borderRadius: '24px', overflow: 'hidden', border: '1.5px solid #F3F4FB', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                    {[
                        { icon: '📝', label: 'Edit Profile Information', action: () => setShowEdit(true) },
                        { icon: '🛡️', label: 'Safety & Privacy Policy', action: () => setShowPolicy(false) || setShowPolicy(true) },
                        { icon: '⭐', label: 'Rate CivilConnect App', action: () => setShowRate(true) },
                    ].map((item, i, arr) => (
                        <div key={item.label}
                            onClick={item.action}
                            className="preference-item-tap"
                            style={{
                                padding: '16px 20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderBottom: i === arr.length - 1 ? 'none' : '1.5px solid #F9FAFB',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #F3F4FB' }}>
                                    <span style={{ fontSize: '15px' }}>{item.icon}</span>
                                </div>
                                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: '700', color: '#374151' }}>{item.label}</span>
                            </div>
                            <span style={{ color: '#D1D5DB', fontSize: '18px' }}>›</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Logout Button */}
            <div style={{ padding: '24px 20px 0' }}>
                <button
                    onClick={handleLogout}
                    className="sign-out-btn-animate"
                    style={{
                        width: '100%', padding: '14px', borderRadius: '14px',
                        background: '#FFF1F2', border: '1px solid #FECDD3',
                        color: '#E11D48', fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: '900',
                        cursor: 'pointer', transition: 'all 0.2s ease'
                    }}
                >
                    Sign Out Account
                </button>
                <p style={{ textAlign: 'center', fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#9CA3AF', marginTop: 8 }}>
                    CivilConnect Version 2.0.4 (Stable)
                </p>
            </div>

            {/* --- Modals/Overlays --- */}

            {/* Edit Profile Modal */}
            {showEdit && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{ background: '#fff', width: '100%', borderRadius: '32px 32px 0 0', padding: '32px 24px', animation: 'slideUp 0.3s ease-out' }}>
                        <div style={{ width: '40px', height: '4px', background: '#E5E7EB', borderRadius: '2px', margin: '0 auto 24px' }} />
                        <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: '800', color: '#111827', marginBottom: 20 }}>Edit Profile</h3>
                        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: '700', color: '#6B7280', display: 'block', marginBottom: 8 }}>Full Name</label>
                                <input
                                    type="text" value={clientName} onChange={(e) => setClientName(e.target.value)}
                                    style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid #E5E7EB', outline: 'none', fontFamily: "'Inter', sans-serif" }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: '700', color: '#6B7280', display: 'block', marginBottom: 8 }}>City</label>
                                <input
                                    type="text" value={clientCity} onChange={(e) => setClientCity(e.target.value)}
                                    style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid #E5E7EB', outline: 'none', fontFamily: "'Inter', sans-serif" }}
                                />
                            </div>
                            <button type="submit" style={{ marginTop: 10, width: '100%', padding: '16px', borderRadius: '14px', background: '#7C3AED', color: '#fff', border: 'none', fontWeight: '800', cursor: 'pointer' }}>
                                Save Changes
                            </button>
                            <button type="button" onClick={() => setShowEdit(false)} style={{ width: '100%', padding: '10px', background: 'none', border: 'none', color: '#6B7280', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Privacy Policy Modal */}
            {showPolicy && (
                <div style={{ position: 'fixed', inset: 0, background: '#fff', zIndex: 1000, overflowY: 'auto' }}>
                    <div style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                            <button onClick={() => setShowPolicy(false)} style={{ border: 'none', background: '#F3F4F6', width: '40px', height: '40px', borderRadius: '12px', fontSize: '20px' }}>‹</button>
                            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: '800' }}>Privacy Policy</h3>
                        </div>
                        <div style={{ fontFamily: "'Inter', sans-serif", lineHeight: 1.6, color: '#4B5563' }}>
                            <h4 style={{ color: '#111827', margin: '20px 0 10px' }}>1. Data Collection</h4>
                            <p>CivilConnect collects information to facilitate connections between clients and civil engineering experts. This includes your name, location, and service history.</p>
                            <h4 style={{ color: '#111827', margin: '20px 0 10px' }}>2. Verified Experts</h4>
                            <p>All service providers undergo a verification process. We share your request details with selected experts to provide accurate quotations.</p>
                            <h4 style={{ color: '#111827', margin: '20px 0 10px' }}>3. Secure Communication</h4>
                            <p>Your contact details are protected. Direct messaging is used only for project-related coordination.</p>
                            <h4 style={{ color: '#111827', margin: '20px 0 10px' }}>4. Payment Reference</h4>
                            <p>Pricing shown in materials and services are reference rates and subject to market fluctuations.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Rate App Modal (Bottom Sheet) */}
            {showRate && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{ background: '#fff', width: '100%', borderRadius: '32px 32px 0 0', padding: '32px 24px', animation: 'slideUp 0.3s ease-out', textAlign: 'center' }}>
                        <div style={{ width: '40px', height: '4px', background: '#E5E7EB', borderRadius: '2px', margin: '0 auto 24px' }} />
                        <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '20px', fontWeight: '900', color: '#111827', marginBottom: 8 }}>Enjoying CivilConnect?</h3>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#6B7280', marginBottom: 24 }}>Your feedback helps us provide better experts.</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 32 }}>
                            {[1, 2, 3, 4, 5].map(s => (
                                <button key={s} onClick={() => setRating(s)} style={{ border: 'none', background: 'none', fontSize: '36px', cursor: 'pointer' }}>
                                    {s <= rating ? '⭐' : '☆'}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => {
                                setShowRate(false);
                                setRating(0); // Reset for next time
                            }}
                            style={{ width: '100%', padding: '16px', borderRadius: '16px', background: rating > 0 ? '#7C3AED' : '#F3F4F6', color: rating > 0 ? '#fff' : '#9CA3AF', border: 'none', fontWeight: '800', cursor: rating > 0 ? 'pointer' : 'default', transition: 'all 0.3s' }}
                            disabled={rating === 0}
                        >
                            Submit Review
                        </button>
                        <button onClick={() => setShowRate(false)} style={{ padding: '16px', color: '#9CA3AF', background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer' }}>Later</button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                .pulse-btn { animation: pulse 2s infinite ease-in-out; }
                .preference-item-tap:active { 
                    transform: scale(0.97) translateX(4px);
                    background: #F9FAFB;
                }
                .sign-out-btn-animate:active {
                    transform: scale(0.97);
                    background: #FFE4E6;
                }
            `}</style>
        </div>
    );
};

export default Profile;
