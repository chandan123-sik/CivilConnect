import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const tabs = [
    {
        path: '/serviceprovider/home',
        label: 'Overview',
        icon: (active) => (
            <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[24px] h-[24px]">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
        ),
    },
    {
        path: '/serviceprovider/requests',
        label: 'Leads',
        icon: (active) => (
            <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[24px] h-[24px]">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
        ),
    },
    {
        path: '/serviceprovider/subscription',
        label: 'Plan',
        icon: (active) => (
            <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[24px] h-[24px]">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
            </svg>
        ),
    },
    {
        path: '/serviceprovider/profile',
        label: 'Profile',
        icon: (active) => (
            <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[24px] h-[24px]">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        ),
    },
];

const ProviderNavbar = () => {
    const location = useLocation();

    return (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white/90 backdrop-blur-2xl border border-white/50 flex z-50 px-4 py-3 rounded-[35px] shadow-[0_20px_40px_rgba(30,58,138,0.08)]">
            {tabs.map(tab => {
                const active = location.pathname.startsWith(tab.path);
                return (
                    <NavLink
                        key={tab.path}
                        to={tab.path}
                        className="flex-1 flex flex-col items-center justify-center no-underline outline-none group"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                        <div className={`w-12 h-10 rounded-2xl flex items-center justify-center transition-all duration-400 ${active ? 'bg-[#1E3A8A] text-white shadow-lg shadow-blue-900/10' : 'bg-transparent text-slate-300 group-hover:text-slate-500'}`}>
                            {tab.icon(active)}
                        </div>
                    </NavLink>
                );
            })}
        </nav>
    );
};

export default ProviderNavbar;
