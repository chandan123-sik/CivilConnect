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
        <div style={{ height: '100dvh', background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Header */}
            <div style={{ padding: '48px 22px 0', flexShrink: 0 }}>
                <button
                    onClick={() => navigate('/')}
                    style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', WebkitTapHighlightColor: 'transparent' }}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 26, height: 26 }}>
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
            </div>

            {/* Title + Subtitle — LEFT aligned */}
            <div style={{ padding: '28px 24px 0', flexShrink: 0 }}>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#111827', lineHeight: 1.3, margin: '0 0 8px 0' }}>
                    Enter your mobile number
                </h1>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#9ca3af', margin: 0, lineHeight: 1.5 }}>
                    We will send you a confirmation code
                </p>
            </div>

            {/* Flex-1 center — "+91" floats in middle */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 400, color: '#9ca3af', letterSpacing: '0.04em', display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span>+91</span>
                    {mobile.length > 0 && (
                        <span style={{ color: '#111827', letterSpacing: '0.1em' }}>{mobile}</span>
                    )}
                </div>
            </div>

            {/* Keypad + Button + Footer */}
            <div style={{ padding: '0 16px 20px', flexShrink: 0 }}>
                <Keypad onNumberPress={handlePress} onDeletePress={handleDelete} />

                {/* Continue — Purple theme */}
                <button
                    onClick={() => isReady && navigate('/auth/otp-verify', { state: { mobile } })}
                    style={{
                        width: '100%',
                        background: isReady ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)' : '#F3F4F6',
                        border: 'none',
                        borderRadius: '16px',
                        padding: '18px 0',
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '16px',
                        fontWeight: '700',
                        color: isReady ? '#fff' : '#b0b0b0',
                        cursor: isReady ? 'pointer' : 'default',
                        transition: 'all 0.2s',
                        boxShadow: isReady ? '0 10px 20px rgba(124, 58, 237, 0.2)' : 'none',
                        WebkitTapHighlightColor: 'transparent',
                        marginBottom: 16,
                    }}
                >
                    Continue
                </button>

                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#9ca3af', textAlign: 'center', lineHeight: 1.7, margin: 0 }}>
                    By continuing, you agree to our{' '}
                    <a href="#" style={{ color: '#7C3AED', textDecoration: 'none', fontWeight: '600' }}>terms & conditions</a>
                    {' '}and{' '}
                    <a href="#" style={{ color: '#7C3AED', textDecoration: 'none', fontWeight: '600' }}>privacy policy</a>
                </p>
            </div>
        </div>
    );
};

export default MobileInput;
