import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateDetails: async (userData) => {
    const response = await api.put('/auth/updatedetails', userData);
    return response.data;
  },

  updatePassword: async (passwordData) => {
    const response = await api.put('/auth/updatepassword', passwordData);
    return response.data;
  },
};

// Analysis APIs
export const analysisAPI = {
  analyzeText: async (data) => {
    const response = await api.post('/analysis/text', data);
    return response.data;
  },

  analyzeUrl: async (data) => {
    const response = await api.post('/analysis/url', data);
    return response.data;
  },

  getHistory: async (page = 1, limit = 10) => {
    const response = await api.get('/analysis/history', {
      params: { page, limit },
    });
    return response.data;
  },

  getAnalysis: async (id) => {
    const response = await api.get(`/analysis/${id}`);
    return response.data;
  },

  deleteAnalysis: async (id) => {
    const response = await api.delete(`/analysis/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/analysis/stats');
    return response.data;
  },
};

// News APIs
export const newsAPI = {
  search: async (query, page = 1, pageSize = 10) => {
    const response = await api.get('/news/search', {
      params: { q: query, page, pageSize },
    });
    return response.data;
  },

  getHeadlines: async (country = 'us', category, page = 1, pageSize = 10) => {
    const response = await api.get('/news/headlines', {
      params: { country, category, page, pageSize },
    });
    return response.data;
  },

  verifySource: async (url) => {
    const response = await api.post('/news/verify-source', { url });
    return response.data;
  },
};

export default api;
