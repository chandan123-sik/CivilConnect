import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ClientLayout from '../layout/ClientLayout';
import Home from '../pages/Home';
import Categories from '../pages/Categories';
import ProviderList from '../pages/ProviderList';
import ProviderProfile from '../pages/ProviderProfile';
import Materials from '../pages/Materials';
import Profile from '../pages/Profile';

// Thin protected check — redirect to auth if no token
const RequireAuth = ({ children }) => {
    const token = localStorage.getItem('access_token');
    if (!token) return <Navigate to="/" replace />;
    return children;
};

const UserRoutes = () => {
    return (
        <RequireAuth>
            <Routes>
                {/* All tabs use ClientLayout (has BottomNavbar) */}
                <Route element={<ClientLayout />}>
                    <Route path="home" element={<Home />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="categories/:categoryId" element={<ProviderList />} />
                    <Route path="materials" element={<Materials />} />
                    <Route path="profile" element={<Profile />} />

                    {/* Default redirect */}
                    <Route index element={<Navigate to="home" replace />} />
                </Route>

                {/* Provider Profile — full screen, NO bottom nav */}
                <Route path="provider/:providerId" element={<ProviderProfile />} />
            </Routes>
        </RequireAuth>
    );
};

export default UserRoutes;
