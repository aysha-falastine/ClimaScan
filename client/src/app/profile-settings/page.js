'use client';

import { useState } from 'react';
import { LayoutDashboard, Home, FileText, MessageSquare, User, LogOut } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

const Sidebar = () => (
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
      <NavIcon href="/logout" icon={LogOut} label="Log Out" />
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
  const [formData, setFormData] = useState({
    name: 'julius',
    email: 'juliuskedienye61@gmail.com',
    password: ''
  });

  const [preferences, setPreferences] = useState({
    location: 'Nairobi',
    mapView: 'Satellite'
  });

  const [saveStatus, setSaveStatus] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    setSaveStatus('saving');
    
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Add JWT token if you have authentication
          // 'Authorization': `Bearer ${token}`
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
      
      // Clear password field after successful save
      setFormData(prev => ({ ...prev, password: '' }));
      
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Save error:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      // Add actual delete API call here
      console.log('Account deletion requested');
      alert('Account deletion functionality will be implemented with proper authentication');
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete account');
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      
      <div className="flex-1 ml-28">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-green-800">Profile Setting</h2>
          
          <div className="flex items-center gap-8">
            <a href="/about" className="text-sm font-medium text-gray-600 hover:text-green-800">ABOUT</a>
            <a href="/contact" className="text-sm font-medium text-gray-600 hover:text-green-800">CONTACT</a>
            <button className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center hover:bg-gray-500 transition-colors">
              <User className="w-6 h-6 text-white" />
            </button>
          </div>
        </header>

        <main className="p-8 overflow-y-auto h-[calc(100vh-80px)] flex items-center justify-center">
          <div className="w-full max-w-xl">
            
            <div className="bg-green-50 rounded-3xl p-12 shadow-sm">
              
              {/* Save Status Messages */}
              {saveStatus === 'saved' && (
                <div className="mb-6 p-3 bg-green-100 border border-green-400 text-green-800 rounded-lg text-center text-sm">
                  ✓ Changes saved successfully!
                </div>
              )}
              
              {saveStatus === 'error' && (
                <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-800 rounded-lg text-center text-sm">
                  ✗ Failed to save changes. Please try again.
                </div>
              )}
              
              <div className="space-y-8">
                {/* Name Field */}
                <div className="flex items-center gap-6">
                  <label className="text-green-700 font-bold w-32 text-left">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Your Name"
                    className="flex-1 bg-white border-0 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-green-400 outline-none"
                  />
                </div>

                {/* Email Field */}
                <div className="flex items-center gap-6">
                  <label className="text-green-700 font-bold w-32 text-left">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Your Email"
                    className="flex-1 bg-white border-0 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-green-400 outline-none"
                  />
                </div>

                {/* Password Field */}
                <div className="flex items-center gap-6">
                  <label className="text-green-700 font-bold w-32 text-left">ChangePassword</label>
                  <div className="flex-1 bg-white rounded-xl px-4 py-3 flex items-center justify-between">
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="New Password"
                      className="flex-1 text-sm text-gray-900 placeholder:text-gray-400 outline-none bg-transparent"
                    />
                  </div>
                </div>

                {/* Preferences Section */}
                <div className="pt-4">
                  <h3 className="text-center text-black font-semibold text-base mb-6">Preferences</h3>
                  
                  <div className="flex items-center justify-center gap-8">
                    {/* Default Location */}
                    <div className="flex flex-col items-center gap-2">
                      <label className="text-xs text-gray-600">Default Location</label>
                      <input
                        type="text"
                        value={preferences.location}
                        onChange={(e) => handlePreferenceChange('location', e.target.value)}
                        placeholder="City"
                        className="w-32 bg-white border-0 rounded-lg px-3 py-2 text-xs text-center text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-green-400 outline-none"
                      />
                    </div>

                    {/* Map View */}
                    <div className="flex flex-col items-center gap-2">
                      <label className="text-xs text-gray-600">Default Map View</label>
                      <select
                        value={preferences.mapView}
                        onChange={(e) => handlePreferenceChange('mapView', e.target.value)}
                        className="w-32 bg-white border-0 rounded-lg px-3 py-2 text-xs text-center text-gray-900 focus:ring-2 focus:ring-green-400 outline-none cursor-pointer"
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
                <div className="flex flex-col gap-3 mt-8">
                  <button 
                    onClick={handleSaveChanges}
                    disabled={saveStatus === 'saving'}
                    className="w-full bg-black text-white py-3 rounded-full text-sm font-medium hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saveStatus === 'saving' ? 'Saving...' : 'Save changes'}
                  </button>
                  
                  <button 
                    onClick={handleDeleteAccount}
                    className="w-full bg-red-600 text-white py-3 rounded-full text-sm font-medium hover:bg-red-700 active:scale-95 transition-all"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Account?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}