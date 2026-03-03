import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Auth pages
import GetStarted from './auth/GetStarted';
import MobileInput from './auth/MobileInput';
import OTPVerification from './auth/OTPVerification';

// User Panel Pages
import ClientLayout from './module/user/layout/ClientLayout';
import Home from './module/user/pages/Home';
import Categories from './module/user/pages/Categories';
import ProviderList from './module/user/pages/ProviderList';
import ProviderProfile from './module/user/pages/ProviderProfile';
import Materials from './module/user/pages/Materials';
import Profile from './module/user/pages/Profile';
import RequestsHistory from './module/user/pages/RequestsHistory';

// Provider Panel Pages
import ProviderLayout from './module/serviceprovider/layout/ProviderLayout';
import ProviderHome from './module/serviceprovider/pages/Home';
import ProviderRequests from './module/serviceprovider/pages/Requests';
import ProviderSubscription from './module/serviceprovider/pages/Subscription';
import ProviderProfileManagement from './module/serviceprovider/pages/Profile';

// Auth Guard
const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('access_token');
  if (!token) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Auth Flow ── */}
        <Route path="/" element={<GetStarted />} />
        <Route path="/auth/mobile-input" element={<MobileInput />} />
        <Route path="/auth/otp-verify" element={<OTPVerification />} />

        {/* ── Client Panel Protected ── All nested under ClientLayout ── */}
        <Route path="/user" element={
          <RequireAuth>
            <ClientLayout />
          </RequireAuth>
        }>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/:categoryId" element={<ProviderList />} />
          <Route path="materials" element={<Materials />} />
          <Route path="requests" element={<RequestsHistory />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Provider profile — full screen, outside ClientLayout (no bottom nav) */}
        <Route path="/user/provider/:providerId" element={
          <RequireAuth>
            <ProviderProfile />
          </RequireAuth>
        } />

        {/* ── Service Provider Panel Panel ── */}
        <Route path="/serviceprovider" element={<ProviderLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<ProviderHome />} />
          <Route path="requests" element={<ProviderRequests />} />
          <Route path="subscription" element={<ProviderSubscription />} />
          <Route path="profile" element={<ProviderProfileManagement />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
