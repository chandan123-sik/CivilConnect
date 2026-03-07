import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import ProviderNavbar from './ProviderNavbar';
import Lenis from 'lenis';

const ProviderLayout = () => {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard expo easing
            direction: 'vertical',
            gestureDirection: 'vertical',
            smoothTransition: true,
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
        });

        const raf = (time) => {
            lenis.raf(time);
            requestAnimationFrame(raf);
        };

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return (
        <div id="provider-layout" className="relative min-h-dvh bg-slate-50 flex flex-col max-w-md mx-auto shadow-sm border-x border-slate-100 pb-[100px]">
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
