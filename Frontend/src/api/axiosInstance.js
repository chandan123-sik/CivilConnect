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
    const allTokens = [providerToken, tempToken, userToken, accessToken, adminToken].filter(t => isValid(t));
    
    if (config.url.includes('/admin')) {
      token = isValid(adminToken) ? adminToken : (allTokens[0] || null);
    } else if (config.url.includes('/provider') || config.url.includes('/leads/provider') || (config.url.includes('/leads') && config.method === 'patch')) {
      token = isValid(providerToken) ? providerToken : (isValid(tempToken) ? tempToken : (allTokens[0] || null));
    } else {
      token = allTokens[0] || null;
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token.trim()}`;
    }

    // DEBUG: Uncomment code below for local terminal/console troubleshooting
    // console.log(`[Axios Request] URL: ${config.url} | Token Found: ${!!token}`);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // Standard unwrap for our successRes system
    const resDto = response.data;
    if (resDto && resDto.success) {
        return resDto.data !== undefined ? resDto.data : resDto;
    }
    return resDto;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const url = error.config?.url || '';
      if (url.includes('/admin')) {
          localStorage.removeItem('cc_admin_token');
          localStorage.removeItem('cc_admin_data');
      } else if (url.includes('/provider') || url.includes('/leads/provider')) {
          localStorage.removeItem('cc_provider_token');
          localStorage.removeItem('cc_provider_data');
      } else {
          localStorage.removeItem('cc_user_token');
          localStorage.removeItem('cc_user_data');
      }
      localStorage.removeItem('access_token'); // Legacy cleanup
    }
    return Promise.reject(error.response?.data?.message || 'Something went wrong');
  }
);

export default axiosInstance;
