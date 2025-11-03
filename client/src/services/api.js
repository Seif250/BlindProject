import axios from 'axios';

// Create axios instance
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor for JWT token
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

// Auth API calls
export const register = async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
};

export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

export const logout = async () => {
    const response = await api.post('/auth/logout');
    return response.data;
};

// User API calls
export const getUserProfile = async () => {
    const response = await api.get('/user/profile');
    return response.data;
};

export const updateUserProfile = async (userData) => {
    const response = await api.put('/user/profile', userData);
    return response.data;
};

export default api;