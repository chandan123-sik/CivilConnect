import axiosInstance from './axiosInstance';

export const sendOTP = (phone) => axiosInstance.post('/auth/send-otp', { phone });

export const verifyOTP = (phone, otp) => axiosInstance.post('/auth/verify-otp', { phone, otp });

export const adminLogin = (username, password) => axiosInstance.post('/admin/login', { username, password });
