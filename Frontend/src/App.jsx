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
import ToastContainer from './components/Toast';

// Admin Panel Pages
import AdminLogin from './module/admin/auth/AdminLogin';
import AdminLayout from './module/admin/layout/AdminLayout';
import AdminDashboard from './module/admin/pages/AdminDashboard';
import ApprovalManagement from './module/admin/pages/ApprovalManagement';
import UserManagement from './module/admin/pages/UserManagement';
import ProviderManagement from './module/admin/pages/ProviderManagement';
import CategoryManagement from './module/admin/pages/CategoryManagement';
import RequestMonitor from './module/admin/pages/RequestMonitor';
import Reports from './module/admin/pages/DisputeCenter';
import SubscriptionPlans from './module/admin/pages/SubscriptionPlans';
import RevenueDashboard from './module/admin/pages/RevenueDashboard';
import MaterialsCatalog from './module/admin/pages/MaterialsCatalog';
import BannerManagement from './module/admin/pages/BannerManagement';
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
import ProviderWorkers from './module/serviceprovider/pages/Workers';

// Auth Guard
const RequireAuth = ({ children, role }) => {
  let token = null;
  
  if (role === 'admin') {
    token = localStorage.getItem('cc_admin_token');
  } else if (role === 'provider') {
    token = localStorage.getItem('cc_provider_token');
  } else {
    token = localStorage.getItem('cc_user_token');
  }

  // Cleanup legacy access_token whenever we check auth
  if (localStorage.getItem('access_token')) {
    localStorage.removeItem('access_token');
  }

  if (!token) {
    if (role === 'admin') return <Navigate to="/admin/login" replace />;
    return <Navigate to="/" replace />;
  }
  return children;
};

// Subscription Guard for Providers
const SubscriptionGuard = ({ children }) => {
  const providerData = JSON.parse(localStorage.getItem('cc_provider_data') || '{}');
  const expiry = providerData.subscriptionExpiry;
  
  const isExpired = !expiry || new Date(expiry) < new Date();

  if (isExpired) {
    return <Navigate to="/serviceprovider/subscription" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* ── Admin Auth & Dashboard ── */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <RequireAuth role="admin">
            <AdminLayout />
          </RequireAuth>
        }>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<AdminDashboard />} />
          <Route path="approvals" element={<ApprovalManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="providers" element={<ProviderManagement />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="requests" element={<RequestMonitor />} />
          <Route path="reports" element={<Reports />} />
          <Route path="subscriptions" element={<SubscriptionPlans />} />
          <Route path="revenue" element={<RevenueDashboard />} />
          <Route path="materials" element={<MaterialsCatalog />} />
          <Route path="banners" element={<BannerManagement />} />
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
          <RequireAuth role="user">
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
          <RequireAuth role="user">
            <ProviderProfile />
          </RequireAuth>
        } />

        {/* ── Service Provider Panel Panel ── */}
        <Route path="/serviceprovider" element={
          <RequireAuth role="provider">
            <ProviderLayout />
          </RequireAuth>
        }>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<SubscriptionGuard><ProviderHome /></SubscriptionGuard>} />
          <Route path="requests" element={<SubscriptionGuard><ProviderRequests /></SubscriptionGuard>} />
          <Route path="subscription" element={<ProviderSubscription />} />
          <Route path="workers" element={<SubscriptionGuard><ProviderWorkers /></SubscriptionGuard>} />
          <Route path="profile" element={<ProviderProfileManagement />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
