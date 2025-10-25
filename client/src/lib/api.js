// src/lib/api.js
// API configuration and helper functions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to handle API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth APIs
export const authAPI = {
  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  signup: async (name, email, password) => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  logout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve();
  },

  getCurrentUser: async () => {
    return apiRequest('/auth/me');
  },
};

// User Profile APIs
export const userAPI = {
  getProfile: async () => {
    return apiRequest('/users/profile');
  },

  updateProfile: async (profileData) => {
    return apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  changePassword: async (currentPassword, newPassword) => {
    return apiRequest('/users/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  deleteAccount: async () => {
    return apiRequest('/users/account', {
      method: 'DELETE',
    });
  },

  updatePreferences: async (preferences) => {
    return apiRequest('/users/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  },
};

// Property APIs
export const propertyAPI = {
  getAllProperties: async () => {
    return apiRequest('/properties');
  },

  getProperty: async (id) => {
    return apiRequest(`/properties/${id}`);
  },

  createProperty: async (propertyData) => {
    return apiRequest('/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  },

  updateProperty: async (id, propertyData) => {
    return apiRequest(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(propertyData),
    });
  },

  deleteProperty: async (id) => {
    return apiRequest(`/properties/${id}`, {
      method: 'DELETE',
    });
  },

  analyzeProperty: async (propertyId) => {
    return apiRequest(`/properties/${propertyId}/analyze`, {
      method: 'POST',
    });
  },
};

// Report APIs
export const reportAPI = {
  getReports: async () => {
    return apiRequest('/reports');
  },

  getReport: async (id) => {
    return apiRequest(`/reports/${id}`);
  },

  generateReport: async (propertyId) => {
    return apiRequest('/reports/generate', {
      method: 'POST',
      body: JSON.stringify({ propertyId }),
    });
  },

  getPropertyReport: async (propertyId) => {
    return apiRequest(`/reports/property/${propertyId}`);
  },

  deleteReport: async (id) => {
    return apiRequest(`/reports/${id}`, {
      method: 'DELETE',
    });
  },
};

// Climate Data APIs
export const climateAPI = {
  getClimateData: async (latitude, longitude) => {
    return apiRequest('/climate/data', {
      method: 'POST',
      body: JSON.stringify({ latitude, longitude }),
    });
  },

  getFloodRisk: async (latitude, longitude) => {
    return apiRequest('/climate/flood-risk', {
      method: 'POST',
      body: JSON.stringify({ latitude, longitude }),
    });
  },

  getHeatRisk: async (latitude, longitude) => {
    return apiRequest('/climate/heat-risk', {
      method: 'POST',
      body: JSON.stringify({ latitude, longitude }),
    });
  },
};

// AI Chat APIs
export const aiChatAPI = {
  sendMessage: async (message, conversationHistory = []) => {
    return apiRequest('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ 
        message, 
        history: conversationHistory 
      }),
    });
  },

  analyzeProperty: async (propertyData) => {
    return apiRequest('/ai/analyze-property', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  },
};

// Dashboard APIs
export const dashboardAPI = {
  getStats: async () => {
    return apiRequest('/dashboard/stats');
  },

  getRecentActivity: async () => {
    return apiRequest('/dashboard/activity');
  },
};

export default {
  auth: authAPI,
  user: userAPI,
  property: propertyAPI,
  report: reportAPI,
  climate: climateAPI,
  aiChat: aiChatAPI,
  dashboard: dashboardAPI,
};