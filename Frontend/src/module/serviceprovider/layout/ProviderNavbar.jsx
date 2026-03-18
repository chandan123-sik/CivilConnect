import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const tabs = [
    {
        path: '/serviceprovider/home',
        label: 'Home',
        icon: (active) => (
            <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
        ),
    },
    {
        path: '/serviceprovider/requests',
        label: 'Requests',
        icon: (active) => (
            <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
        ),
    },
    {
        path: '/serviceprovider/workers',
        label: 'Workers',
        icon: (active) => (
            <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
        ),
    },
    {
        path: '/serviceprovider/profile',
        label: 'Profile',
        icon: (active) => (
            <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        ),
    },
    {
        path: '/serviceprovider/subscription',
        label: 'Plans',
        icon: (active) => (
            <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
            </svg>
        ),
    },
];

const ProviderNavbar = () => {
    const location = useLocation();
    
    // Check subscription status
    const providerData = JSON.parse(localStorage.getItem('cc_provider_data') || '{}');
    const expiry = providerData.subscriptionExpiry;
    
    // Safety check: Ensure expiry is a valid date string and strictly in the past
    // Note: We use < strictly to give them the full final day.
    const isExpired = !expiry || new Date(expiry).getTime() < new Date().getTime();

    const restrictedTabs = ['/serviceprovider/home', '/serviceprovider/requests', '/serviceprovider/workers'];

    return (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-100 flex z-50 px-4 py-3 pb-8 shadow-[0_-8px_20px_rgba(0,0,0,0.03)] rounded-t-[32px]">
            {tabs.map(tab => {
                const active = location.pathname.startsWith(tab.path);
                return (
                    <NavLink
                        key={tab.path}
                        to={tab.path}
                        className={`flex-1 flex flex-col items-center justify-center no-underline outline-none group transition-opacity ${
                            isExpired && restrictedTabs.includes(tab.path) ? 'opacity-30 pointer-events-none' : 'opacity-100'
                        }`}
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-400 ${active ? 'bg-[#1E3A8A] text-white shadow-lg shadow-blue-900/10 scale-110' : 'bg-transparent text-slate-300 group-hover:text-slate-400'}`}>
                            {isExpired && restrictedTabs.includes(tab.path) ? (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0110 0v4" />
                                </svg>
                            ) : tab.icon(active)}
                        </div>
                        <span className={`text-[12px] font-black mt-1.5 transition-colors duration-400 uppercase tracking-tighter ${active ? 'text-[#1E3A8A]' : 'text-slate-400'}`}>
                            {isExpired && restrictedTabs.includes(tab.path) ? 'Locked' : tab.label}
                        </span>
                    </NavLink>
                );
            })}
        </nav>
    );
};

export default ProviderNavbar;
