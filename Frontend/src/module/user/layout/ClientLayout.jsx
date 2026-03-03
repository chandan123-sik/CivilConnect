import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavbar from './BottomNavbar';

const ClientLayout = () => {
    return (
        <div style={{
            minHeight: '100dvh',
            background: '#F5F3FF', // Professional Lavender bg
            paddingBottom: 72,
            position: 'relative'
        }}>
            <Outlet />
            <BottomNavbar />
        </div>
    );
};

export default ClientLayout;
