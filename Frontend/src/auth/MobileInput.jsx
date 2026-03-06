import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Keypad from './components/Keypad';

const MobileInput = () => {
    const navigate = useNavigate();
    const [mobile, setMobile] = useState('');

    const handlePress = (num) => {
        if (mobile.length < 10) setMobile(prev => prev + num);
    };
    const handleDelete = () => setMobile(prev => prev.slice(0, -1));
    const isReady = mobile.length === 10;

    return (
        <div style={{ height: '100dvh', background: '#F8F9FD', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Top Navigation */}
            <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', position: 'relative' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, zIndex: 10 }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
                <div style={{ position: 'absolute', width: '100%', left: 0, textAlign: 'center' }}>
                    <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: '700', color: '#111827' }}>
                        Continue with Phone
                    </h2>
                </div>
            </div>

            {/* Content Area - FIXED LAYOUT NO SCROLL */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 24px', justifyContent: 'flex-start' }}>
                {/* Hand Holding Phone Illustration - MOVED UP & REFINED */}
                <div style={{
                    width: '160px',
                    height: '140px',
                    position: 'relative',
                    marginBottom: '20px',
                    marginTop: '0px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {/* Background Decorative Circles */}
                    <div style={{ position: 'absolute', width: '120px', height: '120px', backgroundColor: '#F0F5FF', borderRadius: '50%', zIndex: 1 }}></div>
                    <div style={{ position: 'absolute', width: '40px', height: '40px', backgroundColor: '#E0E9FF', borderRadius: '50%', top: '10%', right: '10%', zIndex: 1 }}></div>

                    {/* SVG Illustration: Hand holding phone */}
                    <svg width="100" height="120" viewBox="0 0 100 120" style={{ zIndex: 2, position: 'relative' }}>
                        {/* Hand/Fingers */}
                        <path d="M75 55C75 55 85 58 88 70C91 82 85 100 70 110L40 115L25 100L25 70" stroke="#FDE68A" strokeWidth="18" strokeLinecap="round" fill="none" />
                        <path d="M22 65C18 65 15 62 15 58V45C15 41 18 38 22 38" stroke="#FDE68A" strokeWidth="8" strokeLinecap="round" fill="none" />
                        <path d="M22 80C18 80 15 77 15 73V63" stroke="#FDE68A" strokeWidth="8" strokeLinecap="round" fill="none" />

                        {/* Phone Body */}
                        <rect x="28" y="10" width="44" height="88" rx="8" fill="#111827" stroke="#374151" strokeWidth="2" />
                        <rect x="31" y="13" width="38" height="82" rx="6" fill="#F8FAFC" />

                        {/* Phone Screen Elements */}
                        <circle cx="50" cy="35" r="8" fill="#E2E8F0" />
                        <rect x="38" y="48" width="24" height="4" rx="2" fill="#E2E8F0" />
                        <rect x="38" y="56" width="18" height="3" rx="1.5" fill="#E2E8F0" />

                        {/* Sleeve/Arm */}
                        <path d="M60 105L85 95L95 115L70 125Z" fill="#2DD4BF" />
                    </svg>
                </div>

                <p style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '16px',
                    color: '#6B7280',
                    textAlign: 'center',
                    lineHeight: '1.4',
                    maxWidth: '240px',
                    margin: '0 0 24px 0',
                    fontWeight: '500'
                }}>
                    You'll receive a 6 digit code to verify next.
                </p>

                {/* The Input Card */}
                <div style={{
                    width: '100%',
                    background: '#fff',
                    borderRadius: '24px',
                    padding: '8px 8px 8px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.03)',
                    border: '1px solid #F1F5F9',
                }}>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>
                            Enter your phone
                        </p>
                        <div style={{ fontSize: '19px', fontWeight: '700', color: '#111827', display: 'flex', gap: 6 }}>
                            <span style={{ color: '#111827' }}>+91</span>
                            <span>{mobile ? mobile.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3') : ''}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => isReady && navigate('/auth/otp-verify', { state: { mobile } })}
                        style={{
                            background: isReady ? '#7C3AED' : '#F3F4F6',
                            color: isReady ? '#fff' : '#9CA3AF',
                            border: 'none',
                            borderRadius: '20px',
                            minWidth: '100px',
                            height: '54px',
                            fontSize: '14px',
                            fontWeight: '700',
                            cursor: isReady ? 'pointer' : 'default',
                            transition: 'all 0.3s'
                        }}
                    >
                        Continue
                    </button>
                </div>
            </div>

            {/* Keypad Container */}
            <div style={{ background: '#F8F9FD', padding: '10px 20px 24px' }}>
                <Keypad onNumberPress={handlePress} onDeletePress={handleDelete} />
            </div>
        </div>
    );
};

export default MobileInput;
