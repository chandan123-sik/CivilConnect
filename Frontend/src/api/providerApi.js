import axiosInstance from './axiosInstance';

export const createProviderProfile = (formData) => axiosInstance.post('/provider/create-profile', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export const updateProviderProfile = (data) => axiosInstance.put('/provider/profile', data);

export const getProviderProfile = () => axiosInstance.get('/provider/profile');

export const getProviderDashboard = () => axiosInstance.get('/provider/dashboard');

export const getIncomingLeads = () => axiosInstance.get('/leads/provider');

export const updateLeadStatus = (id, status, reason) => axiosInstance.patch(`/leads/${id}/status`, { status, rejectionReason: reason });

export const toggleOnlineStatus = (isOnline) => axiosInstance.patch('/provider/status', { isOnline });

// Workers
export const getWorkers = () => axiosInstance.get('/provider/workers');
export const addWorker = (formData) => axiosInstance.post('/provider/workers', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteWorker = (id) => axiosInstance.delete(`/provider/workers/${id}`);
export const updateWorker = (id, formData) => axiosInstance.put(`/provider/workers/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export const submitFeedback = (data) => axiosInstance.post('/provider/feedback', data);
export const submitReport = (data) => axiosInstance.post('/provider/report', data);
export const getReports = () => axiosInstance.get('/provider/report');
export const initiateSubscription = (planId) => axiosInstance.post('/provider/subscribe', { planId });
