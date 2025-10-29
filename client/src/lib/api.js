const API_URL = process.env.NEXT_PUBLIC_API_URL; 

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
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
    console.log('🔍 Calling API:', `${API_URL}/api/reports/generate/${propertyId}`);

    const response = await fetch(`${API_URL}/api/reports/generate/${propertyId}`, {
      method: 'POST',
      headers: getAuthHeaders()
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
  getCurrentUser: async () => {
    const response = await fetch(`${API_URL}/api/users/me`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to fetch user profile');
    }

    return response.json();
  },

  updateCurrentUser: async (userData) => {
    const response = await fetch(`${API_URL}/api/users/me`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to update profile');
    }

    return response.json();
  },

  deleteCurrentUser: async () => {
    const response = await fetch(`${API_URL}/api/users/me`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to delete account');
    }

    return response.json();
  }
};
