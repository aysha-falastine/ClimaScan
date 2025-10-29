'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Home, FileText, MessageSquare, User, LogOut, Eye, EyeOff, Edit2, Check, X } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

const Sidebar = ({ onLogout }) => (
  <div className="w-28 bg-gray-50 border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col items-center py-8">
    <div className="mb-12">
      <h1 className="text-lg font-bold text-center">
        <span className="text-green-800">Clima</span>
        <span className="text-teal-500">Scan</span>
      </h1>
    </div>
    
    <nav className="flex-1 flex flex-col items-center space-y-6">
      <NavIcon href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
      <NavIcon href="/properties" icon={Home} label="Properties" />
      <NavIcon href="/reports" icon={FileText} label="Reports" />
      <NavIcon href="/ai-chat" icon={MessageSquare} label="AI Chat" />
    </nav>
    
    <div className="mt-auto">
      <button onClick={onLogout} className="flex flex-col items-center gap-2 p-3 rounded-lg transition-all text-gray-600 hover:text-green-800 w-full">
        <LogOut className="w-6 h-6" />
        <span className="text-xs font-medium">Log Out</span>
      </button>
    </div>
  </div>
);

const NavIcon = ({ href, icon: Icon, label, active }) => (
  <a
    href={href}
    className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
      active ? 'text-green-800' : 'text-gray-600 hover:text-green-800'
    }`}
  >
    <Icon className="w-6 h-6" />
    <span className="text-xs font-medium">{label}</span>
  </a>
);

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [preferences, setPreferences] = useState({
    location: '',
    mapView: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setFormData({
          name: data.name || '',
          email: data.email || '',
          password: ''
        });
        setPreferences({
          location: data.defaultLocation || 'Nairobi',
          mapView: data.defaultMapView || 'Satellite'
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    setSaveStatus('saving');
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    try {
      const response = await fetch(`${API_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          ...(formData.password && { password: formData.password }),
          defaultLocation: preferences.location,
          defaultMapView: preferences.mapView
        })
      });

      if (!response.ok) throw new Error('Failed to save changes');

      setSaveStatus('saved');
      setHasChanges(false);
      setFormData(prev => ({ ...prev, password: '' }));
      
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Save error:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const confirmDelete = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    try {
      const response = await fetch(`${API_URL}/users/me`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Account deleted successfully');
        router.push('/login');
      } else {
        throw new Error('Failed to delete account');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete account');
    }
    setShowDeleteConfirm(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <Sidebar onLogout={handleLogout} />
      
      <div className="flex-1 ml-28">
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-3xl font-bold text-green-800">Profile Settings</h2>
          
          <div className="flex items-center gap-8">
            <a href="/about" className="text-sm font-medium text-gray-600 hover:text-green-800 transition-colors">ABOUT</a>
            <a href="/contact" className="text-sm font-medium text-gray-600 hover:text-green-800 transition-colors">CONTACT</a>
            <button className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center hover:shadow-lg transition-all">
              <User className="w-6 h-6 text-white" />
            </button>
          </div>
        </header>

        <main className="p-8 overflow-y-auto h-[calc(100vh-80px)]">
          <div className="max-w-4xl mx-auto">
            
            {/* Status Messages */}
            {saveStatus === 'saved' && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-800 rounded-lg flex items-center gap-3 animate-in slide-in-from-top">
                <Check className="w-5 h-5" />
                <span className="font-medium">Changes saved successfully!</span>
              </div>
            )}
            
            {saveStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-lg flex items-center gap-3 animate-in slide-in-from-top">
                <X className="w-5 h-5" />
                <span className="font-medium">Failed to save changes. Please try again.</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center mb-4 shadow-lg">
                      <User className="w-16 h-16 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{formData.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{formData.email}</p>
                    <div className="w-full pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Location</span>
                        <span className="font-medium text-gray-900">{preferences.location}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Map View</span>
                        <span className="font-medium text-gray-900">{preferences.mapView}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings Form */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Personal Information */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Edit2 className="w-5 h-5 text-green-600" />
                    Personal Information
                  </h3>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your name"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter your email"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Change Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          placeholder="Enter new password"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-12 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Leave blank to keep current password</p>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Preferences</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Default Location</label>
                      <input
                        type="text"
                        value={preferences.location}
                        onChange={(e) => handlePreferenceChange('location', e.target.value)}
                        placeholder="Enter city"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Default Map View</label>
                      <select
                        value={preferences.mapView}
                        onChange={(e) => handlePreferenceChange('mapView', e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all cursor-pointer"
                      >
                        <option>Street</option>
                        <option>Satellite</option>
                        <option>Terrain</option>
                        <option>Hybrid</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleSaveChanges}
                    disabled={saveStatus === 'saving' || !hasChanges}
                    className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                  >
                    {saveStatus === 'saving' ? 'Saving Changes...' : 'Save Changes'}
                  </button>
                  
                  <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="sm:w-auto px-6 bg-white border-2 border-red-500 text-red-600 py-3 rounded-xl font-medium hover:bg-red-50 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Delete Account
                  </button>
                </div>

              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Delete Account?</h3>
            <p className="text-gray-600 mb-6 text-center">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-colors"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}