import axiosInstance from './axiosInstance';

export const getAdminStats = () => axiosInstance.get('/admin/dashboard');
export const getRevenueDashboard = (filter) => axiosInstance.get(`/admin/revenue?filter=${filter}`);
export const getPlatformHealth = () => axiosInstance.get('/admin/health');

export const getPendingApprovals = () => axiosInstance.get('/admin/approvals');

export const updateApprovalStatus = (id, status) => axiosInstance.patch(`/admin/approvals/${id}`, { status });

export const getAllUsers = () => axiosInstance.get('/admin/users');

export const getAllProviders = () => axiosInstance.get('/admin/providers');
export const updateProviderStatus = (id, status) => axiosInstance.patch(`/admin/providers/${id}/status`, { isActive: status });
export const deleteProvider = (id) => axiosInstance.delete(`/admin/providers/${id}`);
export const getAllLeads = () => axiosInstance.get('/admin/leads');
export const getAllOrders = () => axiosInstance.get('/admin/orders');
export const updateOrderStatus = (id, data) => axiosInstance.patch(`/admin/orders/${id}`, data);
export const updateUserStatus = (id, status) => axiosInstance.patch(`/admin/users/${id}/status`, { isActive: status });
export const deleteUser = (id) => axiosInstance.delete(`/admin/users/${id}`);
export const getAdminNotifications = () => axiosInstance.get('/admin/notifications');
export const markNotificationsRead = () => axiosInstance.patch('/admin/notifications/read');



export const getPlans = () => axiosInstance.get('/admin/plans');
export const createPlan = (data) => axiosInstance.post('/admin/plans', data);
export const updatePlan = (id, data) => axiosInstance.put(`/admin/plans/${id}`, data);
export const deletePlan = (id) => axiosInstance.delete(`/admin/plans/${id}`);

// Resource Management
// Categories
export const createCategory = (formData) => axiosInstance.post('/admin/categories', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateCategory = (id, formData) => axiosInstance.put(`/admin/categories/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteCategory = (id) => axiosInstance.delete(`/admin/categories/${id}`);

// Materials
export const createMaterial = (formData) => axiosInstance.post('/admin/materials', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateMaterial = (id, formData) => axiosInstance.put(`/admin/materials/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteMaterial = (id) => axiosInstance.delete(`/admin/materials/${id}`);

// Banners
export const getAllBanners = (type) => axiosInstance.get('/admin/banners', { params: { type } });
export const createBanner = (formData) => axiosInstance.post('/admin/banners', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateBanner = (id, formData) => axiosInstance.put(`/admin/banners/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteBanner = (id) => axiosInstance.delete(`/admin/banners/${id}`);

// CMS & Feedback Management
export const getCMSSettings = () => axiosInstance.get('/admin/settings/policy');
export const updateCMSSettings = (data) => axiosInstance.put('/admin/settings/policy', data);
export const getFeedbacks = () => axiosInstance.get('/admin/feedback');
export const clearFeedbacks = () => axiosInstance.delete('/admin/feedback');

export const getAllReports = () => axiosInstance.get('/admin/reports');
export const replyToReport = (id, reply) => axiosInstance.patch(`/admin/reports/${id}/reply`, { reply });
export const deleteReport = (id) => axiosInstance.delete(`/admin/reports/${id}`);
