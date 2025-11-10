import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Store token if present
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried, try to refresh token
    // But skip refresh for login, register, and refresh endpoints
    if (
      error.response?.status === 401 && 
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/register') &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;

      try {
        const response = await axios.post('/api/auth/refresh', {}, {
          withCredentials: true
        });

        if (response.data.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
