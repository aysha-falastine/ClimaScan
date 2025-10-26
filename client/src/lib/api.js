const API_BASE_URL = 'http://127.0.0.1:5000/api';

export const reportAPI = {
  generateReport: async (propertyId) => {
    console.log('🔍 Calling API:', `${API_BASE_URL}/reports/generate`);
    console.log('🔍 Property ID:', propertyId);
    
    const response = await fetch(`${API_BASE_URL}/reports/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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