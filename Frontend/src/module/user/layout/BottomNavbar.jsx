import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const tabs = [
    {
        path: '/user/home',
        label: 'Home',
        icon: (active) => (
            <svg viewBox="0 0 24 24" fill={active ? 'rgba(124, 58, 237, 0.1)' : 'none'} stroke={active ? '#7C3AED' : '#94A3B8'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        ),
    },
    {
        path: '/user/categories',
        label: 'Categories',
        icon: (active) => (
            <svg viewBox="0 0 24 24" fill={active ? 'rgba(124, 58, 237, 0.1)' : 'none'} stroke={active ? '#7C3AED' : '#94A3B8'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
        ),
    },
    {
        path: '/user/materials',
        label: 'Materials',
        icon: (active) => (
            <svg viewBox="0 0 24 24" fill={active ? 'rgba(124, 58, 237, 0.1)' : 'none'} stroke={active ? '#7C3AED' : '#94A3B8'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
        ),
    },
    {
        path: '/user/profile',
        label: 'Profile',
        icon: (active) => (
            <svg viewBox="0 0 24 24" fill={active ? 'rgba(124, 58, 237, 0.1)' : 'none'} stroke={active ? '#7C3AED' : '#94A3B8'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        ),
    },
];

const BottomNavbar = () => {
    const location = useLocation();

    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(124, 58, 237, 0.1)',
            display: 'flex',
            zIndex: 100,
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            boxShadow: '0 -10px 30px rgba(124, 58, 237, 0.08)',
        }}>
            {tabs.map(tab => {
                const active = location.pathname.startsWith(tab.path);
                return (
                    <NavLink
                        key={tab.path}
                        to={tab.path}
                        style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '12px 0 10px',
                            textDecoration: 'none',
                            gap: 5,
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <div style={{
                            transform: active ? 'scale(1.1) translateY(-2px)' : 'scale(1)',
                            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        }}>
                            {tab.icon(active)}
                        </div>
                        <span style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '11px',
                            fontWeight: active ? '700' : '500',
                            color: active ? '#7C3AED' : '#94A3B8',
                            letterSpacing: '0.01em',
                        }}>
                            {tab.label}
                        </span>
                        {active && (
                            <div style={{
                                width: '4px',
                                height: '4px',
                                borderRadius: '2px',
                                background: '#7C3AED',
                                marginTop: '1px'
                            }} />
                        )}
                    </NavLink>
                );
            })}
        </nav>
    );
};

export default BottomNavbar;
