import axiosInstance from './axiosInstance';

export const getCategories = () => axiosInstance.get('/public/categories');

export const getProviders = (params) => axiosInstance.get('/public/providers', { params });

export const getProviderDetails = (id) => axiosInstance.get(`/public/providers/${id}`);

export const getMaterials = (params) => axiosInstance.get('/public/materials', { params });

export const getBanners = (type) => axiosInstance.get('/public/banners', { params: { type } });

export const getPlans = () => axiosInstance.get('/public/plans');
export const getPolicy = () => axiosInstance.get('/public/policy');
export const getHomeUnified = () => axiosInstance.get('/public/home-unified');
