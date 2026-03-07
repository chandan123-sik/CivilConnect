import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavbar from './BottomNavbar';
import Lenis from 'lenis';

const ClientLayout = () => {
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
        <div id="user-layout" style={{
            minHeight: '100dvh',
            background: '#F5F3FF', // Professional Lavender bg
            paddingBottom: 72,
            position: 'relative',
        }}>
            <Outlet />
            <BottomNavbar />
        </div>
    );
};

export default ClientLayout;
