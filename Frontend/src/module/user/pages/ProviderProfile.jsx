import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockProviders, mockCategories } from '../mockData';

const ProviderProfile = () => {
    const { providerId } = useParams();
    const navigate = useNavigate();
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [requestSent, setRequestSent] = useState(false);
    const [requestText, setRequestText] = useState('');
    const [requestBudget, setRequestBudget] = useState('');

    const allProviders = React.useMemo(() => {
        const localProviders = [];
        const localName = localStorage.getItem('provider_name');
        if (localName) {
            localProviders.push({
                id: 'local-provider-unique', // Same ID used in ProviderList.jsx
                name: localName,
                role: localStorage.getItem('provider_category') || 'Expert Professional',
                experience: localStorage.getItem('provider_experience') || '1',
                rating: localStorage.getItem('provider_rating') || '4.8',
                location: `${localStorage.getItem('provider_city') || 'Local'}, India`,
                availability: 'available',
                categoryId: localStorage.getItem('provider_category')?.toLowerCase() || 'contractor',
                skills: (localStorage.getItem('provider_specialities') || 'Civil Work').split(',').map(s => s.trim()),
                pricing: `₹${localStorage.getItem('provider_pricing') || '1000'}/day`,
                avatar: localStorage.getItem('provider_profile_image'),
                bio: localStorage.getItem('provider_about') || 'No Bio provided.',
                portfolio: localStorage.getItem('provider_work_image') ? [{
                    id: 'local-work-1',
                    image: localStorage.getItem('provider_work_image'),
                    desc: localStorage.getItem('provider_work_desc') || 'Project Showcase'
                }] : []
            });
        }
        return [...localProviders, ...mockProviders];
    }, []);

    const provider = allProviders.find(p => p.id === providerId);
    const category = mockCategories.find(c => c.id === provider?.categoryId);

    if (!provider) return (
        <div style={{ padding: '100px 40px', textAlign: 'center', background: '#F8FAFC', minHeight: '100vh' }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔍</div>
            <h2 style={{ color: '#1E293B', fontWeight: '900' }}>Expert Not Found</h2>
            <p style={{ color: '#64748B', marginTop: '8px' }}>The profile you're looking for might have been removed.</p>
            <button onClick={() => navigate(-1)} style={{ marginTop: '24px', background: '#1E3A8A', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '800' }}>Go Back</button>
        </div>
    );

    const handleSendRequest = () => {
        if (!requestText.trim()) return;

        // Capture User Info from LocalStorage
        const userName = localStorage.getItem('user_name') || 'Guest User';
        const userCity = localStorage.getItem('user_city') || 'Pune';
        const userArea = localStorage.getItem('user_area') || '';
        const userLocation = userArea ? `${userCity}, ${userArea}` : userCity;

        // Create New Lead Object
        const newLead = {
            id: Date.now(),
            type: provider.categoryName === 'Residential' ? '🏠 Residential' : '✨ Expert Service',
            client: userName,
            providerName: provider.name,
            loc: userLocation,
            service: provider.role,
            desc: requestText,
            price: requestBudget ? `₹${Number(requestBudget).toLocaleString('en-IN')}` : 'Negotiable',
            date: 'Just Now',
            status: 'pending',
            phone: localStorage.getItem('user_phone') || '+91 00000 00000'
        };

        // Save to LocalStorage leads pool
        const existingLeads = JSON.parse(localStorage.getItem('cc_leads') || '[]');
        localStorage.setItem('cc_leads', JSON.stringify([newLead, ...existingLeads]));

        setRequestSent(true);
        setTimeout(() => {
            setIsRequestModalOpen(false);
            setRequestSent(false);
            setRequestText('');
            setRequestBudget('');
            navigate('/user/profile');
        }, 1500);
    };

    return (
        <div style={{ position: 'relative', minHeight: '100dvh', background: '#F5F3FF', paddingBottom: 100 }}>
            {/* Premium Sticky Header */}
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                padding: '16px 20px 16px',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid rgba(124, 58, 237, 0.1)'
            }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ background: '#F5F3FF', border: 'none', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>
                <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px', fontWeight: '800', color: '#1F2937' }}>Expert Profile</h1>
                <div style={{ width: 40 }} />
            </div>

            {/* Profile Content */}
            <div style={{ paddingTop: 80 }}>
                {/* Visual Header / Hero */}
                <div style={{
                    padding: '16px 20px 24px',
                    background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                    borderRadius: '0 0 32px 32px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    animation: 'fadeInDown 0.6s ease-out'
                }}>
                    <div style={{
                        width: '88px', height: '88px', borderRadius: '24px',
                        background: '#fff', padding: '3px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                        marginBottom: 12
                    }}>
                        <div style={{ width: '100%', height: '100%', borderRadius: '21px', overflow: 'hidden', background: '#F5F3FF' }}>
                            {provider.avatar ? (
                                <img src={provider.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>
                                    👤
                                </div>
                            )}
                        </div>
                    </div>
                    <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '22px', fontWeight: '900', color: '#fff', margin: '0 0 2px 0' }}>{provider.name}</h2>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: '0 0 16px 0', fontWeight: '500' }}>{provider.role}</p>

                    {/* Floating Stats */}
                    <div style={{
                        display: 'flex', gap: 10,
                        background: 'rgba(255,255,255,0.12)',
                        backdropFilter: 'blur(10px)',
                        padding: '10px 18px', borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <div style={{ textAlign: 'center', padding: '0 12px', borderRight: '1px solid rgba(255,255,255,0.2)' }}>
                            <p style={{ fontSize: '16px', fontWeight: '800', color: '#fff', margin: 0 }}>{provider.experience}+</p>
                            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', margin: 0, textTransform: 'uppercase' }}>Years</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '0 12px', borderRight: '1px solid rgba(255,255,255,0.2)' }}>
                            <p style={{ fontSize: '16px', fontWeight: '800', color: '#fff', margin: 0 }}>{provider.rating || '4.5'}</p>
                            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', margin: 0, textTransform: 'uppercase' }}>Rating</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '0 12px' }}>
                            <p style={{ fontSize: '16px', fontWeight: '800', color: '#fff', margin: 0 }}>200+</p>
                            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', margin: 0, textTransform: 'uppercase' }}>Jobs</p>
                        </div>
                    </div>
                </div>

                {/* Main Details */}
                <div style={{ padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* About Section */}
                    <div>
                        <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: '800', color: '#1F2937', margin: '0 0 12px 0' }}>About</h3>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#6B7280', lineHeight: 1.6, margin: 0 }}>
                            {provider.bio}
                        </p>
                    </div>

                    {/* Skills Section */}
                    <div>
                        <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: '800', color: '#1F2937', margin: '0 0 12px 0' }}>Specialties</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                            {provider.skills.map(skill => (
                                <div key={skill} style={{
                                    padding: '10px 16px', borderRadius: '14px',
                                    background: '#fff', color: '#7C3AED',
                                    fontSize: '13px', fontWeight: '700',
                                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.05)',
                                    border: '1px solid rgba(124, 58, 237, 0.05)'
                                }}>
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Portfolio Section */}
                    {provider.portfolio && provider.portfolio.length > 0 && (
                        <div>
                            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: '800', color: '#1F2937', margin: '0 0 12px 0' }}>Recent Work</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {provider.portfolio.map(item => (
                                    <div key={item.id} style={{
                                        borderRadius: '16px', overflow: 'hidden',
                                        background: '#fff', border: '1.5px solid #F1F5F9',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                                        animation: 'fadeInUp 0.6s ease-out both'
                                    }}>
                                        <img src={item.image} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                                        <div style={{ padding: '12px' }}>
                                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#1F2937', margin: 0, fontWeight: '700' }}>{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Pricing Info Card */}
                    <div style={{
                        background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
                        padding: '20px', borderRadius: '16px',
                        border: '1.5px dashed #C4B5FD',
                        animation: 'fadeInUp 0.6s ease-out 0.4s both'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: '700', color: '#7C3AED', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pricing</h3>
                                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '24px', fontWeight: '800', color: '#1F2937', margin: 0 }}>{provider.pricing}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#6B7280', lineHeight: 1.4, margin: 0 }}>{provider.pricingNote}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Sticky Action */}
            <div style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                padding: '16px 20px 30px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderTop: '1px solid rgba(124, 58, 237, 0.1)',
                zIndex: 101,
                animation: 'slideUpNav 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both'
            }}>
                <button
                    onClick={() => setIsRequestModalOpen(true)}
                    className="pulse-btn"
                    style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                        border: 'none', borderRadius: '14px', padding: '14px 0',
                        fontFamily: "'Inter', sans-serif", fontSize: '16px', fontWeight: '800',
                        color: '#fff', cursor: 'pointer',
                        boxShadow: '0 10px 25px rgba(124, 58, 237, 0.25)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                        transition: 'all 0.2s ease'
                    }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                    Send Service Request
                </button>
            </div>

            {/* Request Modal */}
            {isRequestModalOpen && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    background: 'rgba(45, 27, 105, 0.6)',
                    backdropFilter: 'blur(5px)',
                    display: 'flex', alignItems: 'flex-end'
                }}>
                    <div style={{
                        width: '100%', background: '#fff',
                        borderRadius: '32px 32px 0 0',
                        padding: '32px 24px 48px',
                        animation: 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}>
                        <div style={{ width: '40px', height: '4px', background: '#E5E7EB', borderRadius: '2px', margin: '0 auto 24px' }} />

                        {!requestSent ? (
                            <>
                                <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '20px', fontWeight: '800', color: '#1F2937', margin: '0 0 8px 0' }}>Request Service</h3>
                                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#6B7280', margin: '0 0 24px 0' }}>Tell {provider.name.split(' ')[0]} about the work you need.</p>

                                <textarea
                                    autoFocus
                                    placeholder="Examples: Need wall tiling for 200 sqft, House painting for 3BHK, RCC work for new bungalow..."
                                    value={requestText}
                                    onChange={(e) => setRequestText(e.target.value)}
                                    style={{
                                        width: '100%', minHeight: '140px', background: '#F9FAFB',
                                        borderRadius: '18px',
                                        padding: '16px', fontFamily: "'Inter', sans-serif", fontSize: '15px',
                                        color: '#1F2937', resize: 'none', marginBottom: '24px',
                                        outline: 'none', border: requestText.trim() ? '2px solid #EDE9FE' : '2px solid transparent',
                                        transition: 'all 0.2s'
                                    }}
                                />

                                <div style={{ marginBottom: '24px' }}>
                                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: '700', color: '#1F2937', margin: '0 0 8px 0' }}>Estimate Budget (Optional)</p>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280', fontWeight: 'bold' }}>₹</span>
                                        <input
                                            type="number"
                                            placeholder="Enter amount"
                                            value={requestBudget}
                                            onChange={(e) => setRequestBudget(e.target.value)}
                                            style={{
                                                width: '100%', padding: '14px 16px 14px 32px', background: '#F9FAFB',
                                                borderRadius: '14px', border: '1.5px solid #F3F4F6', outline: 'none',
                                                fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: '600'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 12 }}>
                                    <button
                                        onClick={() => setIsRequestModalOpen(false)}
                                        style={{ flex: 1, padding: '18px', borderRadius: '16px', border: 'none', background: '#F5F3FF', color: '#7C3AED', fontWeight: '700', fontSize: '16px', cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSendRequest}
                                        disabled={!requestText.trim()}
                                        style={{
                                            flex: 2, padding: '18px', borderRadius: '16px', border: 'none',
                                            background: requestText.trim() ? '#7C3AED' : '#E5E7EB',
                                            color: '#fff', fontWeight: '700', fontSize: '16px', cursor: 'pointer'
                                        }}
                                    >
                                        Send Request
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <div style={{
                                    width: '80px', height: '80px', borderRadius: '50%', background: '#DCFCE7',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
                                    fontSize: '40px'
                                }}>✅</div>
                                <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '22px', fontWeight: '800', color: '#1F2937', margin: '0 0 8px 0' }}>Request Sent!</h3>
                                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', color: '#6B7280', margin: 0 }}>{provider.name} will be notified shortly.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideUpNav {
                    from { transform: translateY(100%); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                    100% { transform: scale(1); }
                }
                .pulse-btn:active { transform: scale(0.96); }
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default ProviderProfile;
