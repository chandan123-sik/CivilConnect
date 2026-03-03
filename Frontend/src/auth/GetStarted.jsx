import React from 'react';
import { useNavigate } from 'react-router-dom';

const GetStarted = () => {
    const navigate = useNavigate();

    return (
        <div style={{ position: 'relative', height: '100dvh', width: '100%', overflow: 'hidden', background: '#2D1B69' }}>

            {/* Background Image - Construction Site with dramatic lighting */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1000&q=80')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.5) contrast(1.1)',
                }}
            />

            {/* Gradient Overlay for better text legibility */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, rgba(45, 27, 105, 0.4) 0%, rgba(45, 27, 105, 0.95) 100%)'
            }} />

            {/* Content Container */}
            <div style={{
                position: 'relative',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '0 24px 60px',
                zIndex: 10
            }}>

                {/* Brand Logo/Header Area */}
                <div style={{ marginBottom: 'auto', paddingTop: '60px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: '#8B5CF6',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px',
                            boxShadow: '0 8px 16px rgba(139, 92, 246, 0.3)'
                        }}>🏗️</div>
                        <h1 style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '22px',
                            fontWeight: '800',
                            color: '#fff',
                            letterSpacing: '-0.02em',
                            margin: 0
                        }}>CivilConnect</h1>
                    </div>
                </div>

                {/* Main Text Content */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '36px',
                        fontWeight: '800',
                        color: '#fff',
                        lineHeight: '1.1',
                        margin: '0 0 16px 0',
                        letterSpacing: '-0.04em'
                    }}>
                        Build Your <span style={{ color: '#A78BFA' }}>Future</span> With Us.
                    </h2>
                    <p style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '16px',
                        color: 'rgba(255,255,255,0.7)',
                        lineHeight: '1.6',
                        margin: 0,
                        maxWidth: '280px'
                    }}>
                        Connecting you with the best construction professionals and manpower in one platform.
                    </p>
                </div>

                {/* Get Started Button - Premium Purple Gradient */}
                <button
                    onClick={() => navigate('/auth/mobile-input')}
                    style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                        border: 'none',
                        borderRadius: '18px',
                        padding: '20px 0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        boxShadow: '0 20px 40px rgba(124, 58, 237, 0.4)',
                        marginBottom: '24px',
                        WebkitTapHighlightColor: 'transparent',
                        transition: 'transform 0.1s ease',
                    }}
                    onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
                    onPointerUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                    onPointerLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                    <span style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '17px',
                        fontWeight: '700',
                        color: '#fff',
                        letterSpacing: '0.01em'
                    }}>
                        Get Started
                    </span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </button>

                {/* Indicators / Onboarding Steps */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <div style={{ width: '24px', height: '6px', borderRadius: '3px', background: '#8B5CF6' }} />
                    <div style={{ width: '6px', height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.2)' }} />
                    <div style={{ width: '6px', height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.2)' }} />
                </div>
            </div>
        </div>
    );
};

export default GetStarted;
