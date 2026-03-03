import React from 'react';
import { Outlet } from 'react-router-dom';
import ProviderNavbar from './ProviderNavbar';

const ProviderLayout = () => {
    return (
        <div className="relative min-h-dvh bg-slate-50 flex flex-col max-w-md mx-auto shadow-sm border-x border-slate-100 pb-[100px]">
            {/* Page content */}
            <div className="flex-1 w-full font-sans">
                <Outlet />
            </div>

            {/* Fixed 4-tab bottom navbar */}
            <ProviderNavbar />
        </div>
    );
};

export default ProviderLayout;
