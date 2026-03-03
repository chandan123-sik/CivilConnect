import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CompleteProfile = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!name.trim()) {
            setError('Full name is required');
            return;
        }
        // Save profile info
        localStorage.setItem('client_name', name.trim());
        if (city.trim()) localStorage.setItem('client_city', city.trim());
        localStorage.setItem('profile_complete', 'true');

        // Go to client home
        navigate('/user/home');
    };

    return (
        <div style={{ height: '100dvh', background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Header accent */}
            <div style={{
                background: 'linear-gradient(160deg, #0EA5E9 0%, #0369A1 100%)',
                padding: '52px 24px 32px',
                flexShrink: 0,
            }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>👤</div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: '#fff', margin: '0 0 6px' }}>
                    Set up your profile
                </h1>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                    Tell us a bit about yourself to get started
                </p>
            </div>

            {/* Form */}
            <div style={{ flex: 1, padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto' }}>

                {/* Full Name */}
                <div>
                    <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>
                        Full Name <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => { setName(e.target.value); setError(''); }}
                        placeholder="Enter your full name"
                        style={{
                            width: '100%',
                            border: error ? '1.5px solid #EF4444' : '1.5px solid #E5E7EB',
                            borderRadius: 14,
                            padding: '14px 16px',
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 15,
                            color: '#111827',
                            outline: 'none',
                            boxSizing: 'border-box',
                            transition: 'border-color 0.2s',
                        }}
                        onFocus={e => { if (!error) e.target.style.borderColor = '#0EA5E9'; }}
                        onBlur={e => { if (!error) e.target.style.borderColor = '#E5E7EB'; }}
                    />
                    {error && (
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#EF4444', margin: '6px 0 0' }}>{error}</p>
                    )}
                </div>

                {/* City Optional */}
                <div>
                    <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>
                        City / Location <span style={{ fontWeight: 400, color: '#9CA3AF' }}>(optional)</span>
                    </label>
                    <input
                        type="text"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder="e.g. Pune, Mumbai"
                        style={{
                            width: '100%',
                            border: '1.5px solid #E5E7EB',
                            borderRadius: 14,
                            padding: '14px 16px',
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 15,
                            color: '#111827',
                            outline: 'none',
                            boxSizing: 'border-box',
                            transition: 'border-color 0.2s',
                        }}
                        onFocus={e => { e.target.style.borderColor = '#0EA5E9'; }}
                        onBlur={e => { e.target.style.borderColor = '#E5E7EB'; }}
                    />
                </div>

                <div style={{ background: '#F0F9FF', borderRadius: 12, padding: '12px 14px' }}>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#0369A1', margin: 0, lineHeight: 1.5 }}>
                        ℹ️ This information is used to personalise your experience. You can update it later from your profile.
                    </p>
                </div>
            </div>

            {/* Submit Button */}
            <div style={{ padding: '12px 24px 32px', flexShrink: 0 }}>
                <button
                    onClick={handleSubmit}
                    style={{
                        width: '100%',
                        background: 'linear-gradient(160deg, #0EA5E9 0%, #0369A1 100%)',
                        border: 'none',
                        borderRadius: 9999,
                        padding: '17px 0',
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 18,
                        fontWeight: 700,
                        color: '#fff',
                        cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(14,165,233,0.3)',
                        WebkitTapHighlightColor: 'transparent',
                    }}
                    onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.98)'; }}
                    onPointerUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                    onPointerLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                    Continue to Dashboard →
                </button>
            </div>
        </div>
    );
};

export default CompleteProfile;
