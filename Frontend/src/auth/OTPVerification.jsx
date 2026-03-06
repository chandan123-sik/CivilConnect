import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Keypad from './components/Keypad';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 37;

const OTPVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const mobile = location.state?.mobile || '9373300329';

    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(RESEND_SECONDS);

    useEffect(() => {
        if (timer <= 0) return;
        const id = setInterval(() => setTimer(t => t - 1), 1000);
        return () => clearInterval(id);
    }, [timer]);

    const formatted = () => {
        const m = Math.floor(timer / 60);
        const s = timer % 60;
        return `0${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handlePress = (num) => {
        if (otp.length < OTP_LENGTH) setOtp(prev => prev + num);
    };
    const handleDelete = () => setOtp(prev => prev.slice(0, -1));
    const isReady = otp.length === OTP_LENGTH;

    const handleEnter = () => {
        if (!isReady) return;

        // Set a dummy token for the session to indicate successful OTP verification
        localStorage.setItem('access_token', 'temp_verified_token');

        // Always navigate to role selection as requested by the user
        // This ensures they can choose between User and Service Provider every time they login/verify
        navigate('/auth/role-selection');
    };

    return (
        <div style={{ height: '100dvh', background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Header — back + label on same line */}
            <div style={{ padding: '48px 22px 0', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                <button
                    onClick={() => navigate('/auth/mobile-input')}
                    style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', WebkitTapHighlightColor: 'transparent' }}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#6b7280', fontWeight: 500, letterSpacing: '0.01em' }}>
                    Verify mobile number
                </span>
            </div>

            {/* Title + Subtitle — LEFT aligned */}
            <div style={{ padding: '28px 24px 0', flexShrink: 0 }}>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#111827', lineHeight: 1.3, margin: '0 0 8px 0' }}>
                    Enter code sent to your number
                </h1>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#9ca3af', margin: 0, lineHeight: 1.6 }}>
                    We sent it to the number{' '}
                    <span style={{ color: '#374151', fontWeight: 500 }}>+91 {mobile}</span>
                </p>
            </div>

            {/* OTP 6 Dots */}
            <div style={{ padding: '32px 0 0', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, flexShrink: 0 }}>
                {[...Array(OTP_LENGTH)].map((_, i) => (
                    <div key={i} style={{
                        width: 12, height: 12, borderRadius: '50%',
                        background: i < otp.length ? '#7C3AED' : '#e5e7eb',
                        transform: i < otp.length ? 'scale(1.1)' : 'scale(1)',
                        transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        boxShadow: i < otp.length ? '0 0 10px rgba(124, 58, 237, 0.3)' : 'none'
                    }} />
                ))}
            </div>

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Keypad + Timer + Button */}
            <div style={{ padding: '0 16px 20px', flexShrink: 0 }}>
                <Keypad onNumberPress={handlePress} onDeletePress={handleDelete} />

                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#9ca3af', textAlign: 'center', margin: '4px 0 20px', letterSpacing: '0.01em' }}>
                    Resend code in{' '}
                    <span style={{ color: '#7C3AED', fontWeight: '700' }}>{formatted()}</span>
                </p>

                {/* Enter Button — Purple theme */}
                <button
                    onClick={handleEnter}
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
                    }}
                >
                    Verify & Continue
                </button>
            </div>
        </div>
    );
};

export default OTPVerification;
