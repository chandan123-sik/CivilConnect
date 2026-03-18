import axiosInstance from './axiosInstance';

export const completeProfile = (formData) => axiosInstance.post('/user/complete-profile', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export const getUserProfile = () => axiosInstance.get('/user/profile');

// Leads
export const getHiringHistory = () => axiosInstance.get('/leads');
export const createLead = (leadData) => axiosInstance.post('/leads', leadData);

// Material Orders
export const createOrder = (orderData) => axiosInstance.post('/user/orders', orderData);
export const getOrders = () => axiosInstance.get('/user/orders');
export const submitFeedback = (data) => axiosInstance.post('/user/feedback', data);
export const submitReport = (data) => axiosInstance.post('/user/report', data);
export const getReports = () => axiosInstance.get('/user/report');
export const updateLeadStatus = (id, data) => axiosInstance.patch(`/leads/${id}/status`, data);
