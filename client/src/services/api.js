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
    const response = await api.post('/api/auth/signup', userData);
    return response.data;
};

export const login = async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
};

export const logout = async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
};

// User API calls
export const getUserProfile = async () => {
    const response = await api.get('/api/users/profile');
    return response.data;
};

export const updateUserProfile = async (userData) => {
    const response = await api.put('/api/users/profile', userData);
    return response.data;
};

// Conversation API calls
export const requestConversation = async ({ recipientId, message }) => {
    const response = await api.post('/api/conversations', { recipientId, message });
    return response.data;
};

export const getPendingConversationRequests = async () => {
    const response = await api.get('/api/conversations/pending');
    return response.data;
};

export const respondToConversationRequest = async (conversationId, action) => {
    const response = await api.post(`/api/conversations/${conversationId}/respond`, { action });
    return response.data;
};

export const getConversations = async () => {
    const response = await api.get('/api/conversations');
    return response.data;
};

export const getConversationMessages = async (conversationId) => {
    const response = await api.get(`/api/conversations/${conversationId}/messages`);
    return response.data;
};

export const sendConversationMessage = async (conversationId, content) => {
    const response = await api.post(`/api/conversations/${conversationId}/messages`, { content });
    return response.data;
};

export default api;