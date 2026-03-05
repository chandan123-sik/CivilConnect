import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Auth pages
import GetStarted from './auth/GetStarted';
import MobileInput from './auth/MobileInput';
import OTPVerification from './auth/OTPVerification';
import RoleSelection from './auth/RoleSelection';
import CompleteProfile from './auth/CompleteProfile';
import ProviderOnboardingPlans from './auth/ProviderOnboardingPlans';
import CreateProfessionalProfile from './auth/CreateProfessionalProfile';

// Admin Panel Pages
import AdminLogin from './module/admin/auth/AdminLogin';
import AdminLayout from './module/admin/layout/AdminLayout';
import AdminDashboard from './module/admin/pages/AdminDashboard';
import ApprovalManagement from './module/admin/pages/ApprovalManagement';
import UserManagement from './module/admin/pages/UserManagement';
import ProviderManagement from './module/admin/pages/ProviderManagement';
import CategoryManagement from './module/admin/pages/CategoryManagement';
import RequestMonitor from './module/admin/pages/RequestMonitor';
import DisputeCenter from './module/admin/pages/DisputeCenter';
import SubscriptionPlans from './module/admin/pages/SubscriptionPlans';
import RevenueDashboard from './module/admin/pages/RevenueDashboard';
import MaterialsCatalog from './module/admin/pages/MaterialsCatalog';
import AdminSettings from './module/admin/pages/AdminSettings';

// Clean out unused legacy imports mapping to prior names
// (ProviderManagement, CategoryManagement etc are replaced by these unified ones)

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
        {/* ── Admin Auth & Dashboard ── */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<AdminDashboard />} />
          <Route path="approvals" element={<ApprovalManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="providers" element={<ProviderManagement />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="requests" element={<RequestMonitor />} />
          <Route path="disputes" element={<DisputeCenter />} />
          <Route path="subscriptions" element={<SubscriptionPlans />} />
          <Route path="revenue" element={<RevenueDashboard />} />
          <Route path="materials" element={<MaterialsCatalog />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* ── Auth Flow ── */}
        <Route path="/" element={<GetStarted />} />
        <Route path="/auth/mobile-input" element={<MobileInput />} />
        <Route path="/auth/otp-verify" element={<OTPVerification />} />
        <Route path="/auth/role-selection" element={<RoleSelection />} />
        <Route path="/auth/complete-profile" element={<CompleteProfile />} />
        <Route path="/auth/provider-plans" element={<ProviderOnboardingPlans />} />
        <Route path="/auth/create-professional-profile" element={<CreateProfessionalProfile />} />

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
