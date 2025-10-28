const API_BASE_URL = 'http://127.0.0.1:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    // Use the same key used by the app login flow ('token')
    return localStorage.getItem('token');
  }
  return null;
};

// Helper function to create headers with auth
const getAuthHeaders = () => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Report API
export const reportAPI = {
  generateReport: async (propertyId) => {
    console.log('🔍 Calling API:', `${API_BASE_URL}/reports/generate`);
    console.log('🔍 Property ID:', propertyId);
    
    const response = await fetch(`${API_BASE_URL}/reports/generate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ property_id: propertyId })
    });
    
    console.log('🔍 Response status:', response.status);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('❌ API Error:', error);
      throw new Error(error.error || 'Failed to generate report');
    }
    
    const data = await response.json();
    console.log('✅ API Response:', data);
    return data;
  }
};

// User API
export const userAPI = {
  // Get current user profile
  getCurrentUser: async () => {
    console.log('🔍 Fetching current user profile');
    
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    console.log('🔍 Response status:', response.status);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('❌ API Error:', error);
      throw new Error(error.message || 'Failed to fetch user profile');
    }
    
    const data = await response.json();
    console.log('✅ User profile fetched:', data);
    return data;
  },

  // Update current user profile
  updateCurrentUser: async (userData) => {
    console.log('🔍 Updating user profile');
    console.log('🔍 Data:', userData);
    
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    
    console.log('🔍 Response status:', response.status);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('❌ API Error:', error);
      throw new Error(error.message || 'Failed to update profile');
    }
    
    const data = await response.json();
    console.log('✅ Profile updated:', data);
    return data;
  },

  // Delete current user account
  deleteCurrentUser: async () => {
    console.log('🔍 Deleting user account');
    
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    console.log('🔍 Response status:', response.status);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('❌ API Error:', error);
      throw new Error(error.message || 'Failed to delete account');
    }
    
    const data = await response.json();
    console.log('✅ Account deleted:', data);
    return data;
  }
};