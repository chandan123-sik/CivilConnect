import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    let token = null;
    const adminToken = localStorage.getItem('cc_admin_token');
    const providerToken = localStorage.getItem('cc_provider_token');
    const userToken = localStorage.getItem('cc_user_token');
    const tempToken = localStorage.getItem('cc_temp_token');
    const accessToken = localStorage.getItem('access_token'); // Legacy fallback

    const isValid = (t) => t && t !== 'null' && t !== 'undefined';

    // Smart token selection based on request URL
    if (config.url.includes('/admin')) {
      token = isValid(adminToken) ? adminToken : (isValid(accessToken) ? accessToken : null);
    } else if (config.url.includes('/provider') || config.url.includes('/leads/provider') || (config.url.includes('/leads') && config.method === 'patch')) {
      // For provider routes, prefer provider token, then temp tokens (crucial for onboarding)
      token = isValid(providerToken) ? providerToken : (isValid(tempToken) ? tempToken : (isValid(accessToken) ? accessToken : null));
    } else {
      // Default fallback for client/public routes
      token = isValid(userToken) ? userToken : (isValid(tempToken) ? tempToken : (isValid(accessToken) ? accessToken : null));
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token.trim()}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data && response.data.success !== undefined) {
      return response.data.data !== undefined ? response.data.data : response.data;
    }
    return response.data;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear all tokens on unauthorized
      localStorage.removeItem('cc_admin_token');
      localStorage.removeItem('cc_user_token');
      localStorage.removeItem('cc_provider_token');
      localStorage.removeItem('access_token');
    }
    return Promise.reject(error.response?.data?.message || 'Something went wrong');
  }
);

export default axiosInstance;
