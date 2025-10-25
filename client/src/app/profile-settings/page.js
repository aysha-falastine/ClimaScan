'use client';

import { useState, useEffect } from 'react';
import { LayoutDashboard, Home, FileText, MessageSquare, LogOut, User } from 'lucide-react';
import { userAPI } from '@/lib/api';

// Sidebar Component
const Sidebar = () => (
  <div className="w-28 bg-[#F5F5F5] border-r border-gray-300 h-screen fixed left-0 top-0 flex flex-col items-center py-8">
    <div className="mb-12">
      <h1 className="text-lg font-bold text-center">
        <div className="text-[#2D5F3F]">Clima</div>
        <div className="text-[#5DABBC]">Scan</div>
      </h1>
    </div>
    
    <nav className="flex-1 flex flex-col items-center space-y-6">
      <NavIcon href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
      <NavIcon href="/properties" icon={Home} label="Properties" />
      <NavIcon href="/reports" icon={FileText} label="Reports" />
      <NavIcon href="/profile-settings" icon={User} label="Profile" active />
    </nav>
    
    <div className="mt-auto">
      <NavIcon href="/logout" icon={LogOut} label="Log Out" />
    </div>
  </div>
);

const NavIcon = ({ href, icon: Icon, label, active }) => (
  <a
    href={href}
    className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all group ${
      active ? 'text-[#2D5F3F]' : 'text-gray-600 hover:text-[#2D5F3F]'
    }`}
    title={label}
  >
    <Icon className={`w-6 h-6 ${active ? 'text-[#2D5F3F]' : 'text-gray-600 group-hover:text-[#2D5F3F]'}`} />
    <span className="text-xs font-medium">{label}</span>
  </a>
);

// Main Profile Settings Page
export default function ProfileSettingsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: ''
  });

  const [preferences, setPreferences] = useState({
    location: '',
    mapView: 'Default Map View'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const data = await userAPI.getProfile();
      
      setFormData({
        name: data.name || '',
        email: data.email || '',
        currentPassword: '',
        newPassword: ''
      });

      setPreferences({
        location: data.preferences?.default_location || '',
        mapView: data.preferences?.map_view || 'Default Map View'
      });
      
      setError('');
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      setMessage('');
      setError('');

      // Update profile (name and email)
      await userAPI.updateProfile({
        name: formData.name,
        email: formData.email
      });

      // Update preferences
      await userAPI.updatePreferences({
        location: preferences.location,
        mapView: preferences.mapView
      });

      // Change password if provided
      if (formData.currentPassword && formData.newPassword) {
        await userAPI.changePassword(
          formData.currentPassword,
          formData.newPassword
        );
        setFormData(prev => ({ 
          ...prev, 
          currentPassword: '', 
          newPassword: '' 
        }));
      }

      setMessage('Changes saved successfully!');
      setTimeout(() => setMessage(''), 3000);
      
    } catch (err) {
      console.error('Save failed:', err);
      setError(err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and will delete all your properties and reports.'
    );
    
    if (!confirmed) return;

    const doubleCheck = window.confirm(
      'This is your final warning. Are you absolutely sure you want to permanently delete your account?'
    );
    
    if (!doubleCheck) return;

    try {
      setSaving(true);
      await userAPI.deleteAccount();
      alert('Account deleted successfully. You will be redirected to the login page.');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Failed to delete account. Please try again.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-white items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D5F3F] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      
      <div className="flex-1 ml-28">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#2D5F3F]">Profile Setting</h2>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="/about" className="text-sm font-medium text-gray-600 hover:text-[#2D5F3F]">
              ABOUT
            </a>
            <a href="/contact" className="text-sm font-medium text-gray-600 hover:text-[#2D5F3F]">
              CONTACT
            </a>
            <a 
              href="/profile-settings"
              className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5DABBC] to-[#2D5F3F] flex items-center justify-center text-white font-semibold hover:shadow-lg transition-shadow cursor-pointer"
            >
              <User className="w-6 h-6" />
            </a>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8 overflow-y-auto h-[calc(100vh-80px)]">
          <div className="max-w-2xl mx-auto">
            
            {/* Success/Error Messages */}
            {message && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                ✓ {message}
              </div>
            )}
            
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                ⚠ {error}
              </div>
            )}

            {/* Profile Form Card */}
            <div className="bg-[#F0F8F0] border border-gray-200 rounded-lg p-8">
              
              <div className="space-y-6">
                {/* Name Field */}
                <div className="flex items-center justify-between">
                  <label className="text-[#2D5F3F] font-semibold w-40">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Your Name"
                    className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#5DABBC] focus:border-[#5DABBC] outline-none"
                  />
                </div>

                {/* Email Field */}
                <div className="flex items-center justify-between">
                  <label className="text-[#2D5F3F] font-semibold w-40">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Your Email"
                    className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#5DABBC] focus:border-[#5DABBC] outline-none"
                  />
                </div>

                {/* Current Password Field */}
                <div className="flex items-center justify-between">
                  <label className="text-[#2D5F3F] font-semibold w-40">Current Password</label>
                  <input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                    placeholder="Enter current password"
                    className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#5DABBC] focus:border-[#5DABBC] outline-none"
                  />
                </div>

                {/* New Password Field */}
                <div className="flex items-center justify-between">
                  <label className="text-[#2D5F3F] font-semibold w-40">New Password</label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    placeholder="Enter new password"
                    className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#5DABBC] focus:border-[#5DABBC] outline-none"
                  />
                </div>

                {/* Divider */}
                <div className="border-t border-gray-300 my-6"></div>

                {/* Preferences Section */}
                <div>
                  <h3 className="text-[#2D5F3F] font-bold text-lg mb-4 text-center">Preferences</h3>
                  
                  {/* Default Location */}
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-[#2D5F3F] font-semibold w-40">Default Location</label>
                    <input
                      type="text"
                      value={preferences.location}
                      onChange={(e) => handlePreferenceChange('location', e.target.value)}
                      placeholder="Nairobi"
                      className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#5DABBC] focus:border-[#5DABBC] outline-none"
                    />
                  </div>

                  {/* Map View */}
                  <div className="flex items-center justify-between">
                    <label className="text-[#2D5F3F] font-semibold w-40">Map View</label>
                    <select
                      value={preferences.mapView}
                      onChange={(e) => handlePreferenceChange('mapView', e.target.value)}
                      className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#5DABBC] focus:border-[#5DABBC] outline-none"
                    >
                      <option>Default Map View</option>
                      <option>Satellite View</option>
                      <option>Terrain View</option>
                      <option>Hybrid View</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 mt-8">
                  <button
                    onClick={handleSaveChanges}
                    disabled={saving}
                    className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  
                  <button
                    onClick={handleDeleteAccount}
                    disabled={saving}
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Delete Account
                  </button>
                </div>

                {/* Password Change Note */}
                {(formData.currentPassword || formData.newPassword) && (
                  <p className="text-xs text-gray-600 text-center mt-2">
                    💡 Leave password fields empty if you don't want to change your password
                  </p>
                )}
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}