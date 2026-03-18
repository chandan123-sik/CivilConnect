import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Keypad from './components/Keypad';
import { verifyOTP } from '../api/authApi';
import { showToast } from '../components/Toast';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 37;

const OTPVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const mobile = location.state?.mobile || '9373300329';

    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(RESEND_SECONDS);
    const [loading, setLoading] = useState(false);

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
    const handleOtpDelete = () => setOtp(prev => prev.slice(0, -1));

    const isReady = otp.length === OTP_LENGTH;

    const handleEnter = async () => {
        if (!isReady || loading) return;
        setLoading(true);
        try {
            const res = await verifyOTP(mobile, otp);
            
            if (res.isNew) {
                // New user flow - we don't know the role yet, so using temporary cc_temp_token
                localStorage.setItem('cc_user_phone', mobile);
                if (res.token) localStorage.setItem('cc_temp_token', res.token);
                navigate('/auth/role-selection');
            } else {
                // Existing user - store in role-specific key
                if (res.role === 'provider') {
                    localStorage.setItem('cc_provider_token', res.token);
                    localStorage.setItem('cc_provider_data', JSON.stringify(res.user));
                } else if (res.role === 'admin') {
                    localStorage.setItem('cc_admin_token', res.token);
                    localStorage.setItem('cc_admin_data', JSON.stringify(res.user));
                } else {
                    localStorage.setItem('cc_user_token', res.token);
                    localStorage.setItem('cc_user_data', JSON.stringify(res.user));
                }

                localStorage.setItem('cc_current_role', res.role);
                localStorage.removeItem('cc_temp_token'); // Cleanup temp token if it exists
                
                // Route based on role
                if (res.role === 'admin') navigate('/admin/dashboard/home');
                else if (res.role === 'provider') navigate('/serviceprovider/home');
                else navigate('/user/home');
            }
        } catch (err) {
            showToast(err || "Invalid OTP", 'error');
            setOtp(''); // Clear if failed
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ height: '100dvh', background: '#F8F9FD', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header Area - Compact padding */}
            <div style={{ padding: '15px 24px', display: 'flex', alignItems: 'center', position: 'relative' }}>
                <button
                    onClick={() => navigate('/auth/mobile-input')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, zIndex: 10 }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <div style={{ position: 'absolute', width: '100%', left: 0, textAlign: 'center' }}>
                    <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: '700', color: '#111827' }}>
                        Verify Phone
                    </h2>
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '10px', paddingLeft: '24px', paddingRight: '24px' }}>
                <p style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '15px',
                    color: '#6B7280',
                    textAlign: 'center',
                    marginBottom: '24px',
                }}>
                    Code is sent to <span style={{ color: '#111827', fontWeight: '500' }}>+91 {mobile.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')}</span>
                </p>

                {/* OTP Boxes - Light & Centered */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                    {[...Array(OTP_LENGTH)].map((_, i) => (
                        <div key={i} style={{
                            width: '44px',
                            height: '50px',
                            background: '#F1F5F9',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            fontWeight: '700',
                            color: '#111827',
                            border: otp.length === i ? '2px solid #7C3AED' : '1px solid transparent',
                            transition: 'all 0.2s'
                        }}>
                            {otp[i] || ''}
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>
                        Didn't receive code? <span style={{ color: '#111827', fontWeight: '700', cursor: 'pointer' }}>Request again</span>
                    </p>
                    <p style={{ fontSize: '14px', color: '#7C3AED', fontWeight: '700', cursor: 'pointer' }}>
                        Get via Call
                    </p>
                </div>

                {/* Main Button */}
                <button
                    onClick={handleEnter}
                    disabled={!isReady || loading}
                    style={{
                        width: '100%',
                        background: isReady ? (loading ? '#9CA3AF' : '#7C3AED') : '#F3F4F6',
                        color: isReady ? '#fff' : '#9CA3AF',
                        border: 'none',
                        borderRadius: '20px',
                        padding: '16px 0',
                        fontSize: '16px',
                        fontWeight: '700',
                        cursor: isReady ? 'pointer' : 'default',
                        transition: 'all 0.3s',
                        marginBottom: '4px'
                    }}
                >
                    {loading ? 'Verifying...' : 'Verify and Continue'}
                </button>
            </div>

            {/* Keypad integrated at bottom */}
            <div style={{ background: '#F8F9FD', padding: '0 24px 20px' }}>
                <Keypad onNumberPress={handlePress} onDeletePress={handleOtpDelete} />
            </div>
        </div>
    );
};

export default OTPVerification;
