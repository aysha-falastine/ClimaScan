'use client';

import { useState } from 'react';
import { LayoutDashboard, Home, TrendingUp, User, LogOut } from 'lucide-react';

const Sidebar = () => (
  <div className="w-28 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col items-center py-6">
    <div className="mb-8">
      <h1 className="text-lg font-bold text-center">
        <span className="text-green-800">Clima</span>
        <span className="text-teal-500">Scan</span>
      </h1>
    </div>
    
    <nav className="flex-1 flex flex-col items-center space-y-8">
      <NavIcon icon={LayoutDashboard} label="Dashboard" />
      <NavIcon icon={Home} label="Properties" />
      <NavIcon icon={TrendingUp} label="Reports" />
    </nav>
    
    <div className="mt-auto">
      <NavIcon icon={LogOut} label="Log Out" />
    </div>
  </div>
);

const NavIcon = ({ icon: Icon, label, active }) => (
  <button className={`flex flex-col items-center gap-1 p-2 transition-all ${
    active ? 'text-green-800' : 'text-gray-400 hover:text-green-800'
  }`}>
    <Icon className="w-6 h-6" />
    <span className="text-xs">{label}</span>
  </button>
);

export default function ProfileSettingsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [preferences, setPreferences] = useState({
    location: '',
    mapView: 'Street'
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-28">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-green-800">Profile Setting</h2>
          
          <div className="flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-green-800">ABOUT</a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-green-800">CONTACT</a>
            <button className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </button>
          </div>
        </header>

        <main className="p-8 overflow-y-auto h-[calc(100vh-80px)] flex items-center justify-center">
          <div className="w-full max-w-xl">
            
            <div className="bg-green-50 rounded-3xl p-12 shadow-sm">
              
              <div className="space-y-8">
                {/* Name Field */}
                <div className="flex items-center gap-6">
                  <label className="text-green-700 font-bold w-32 text-left">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Your Name"
                    className="flex-1 bg-white border-0 rounded-xl px-4 py-3 text-sm text-gray-400 focus:ring-2 focus:ring-green-400 outline-none"
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
                    className="flex-1 bg-white border-0 rounded-xl px-4 py-3 text-sm text-gray-400 focus:ring-2 focus:ring-green-400 outline-none"
                  />
                </div>

                {/* Password Field with Change Link */}
                <div className="flex items-center gap-6">
                  <label className="text-green-700 font-bold w-32 text-left">ChangePassword</label>
                  <div className="flex-1 bg-white rounded-xl px-4 py-3 flex items-center justify-between">
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Password"
                      className="flex-1 text-sm text-gray-900 outline-none bg-transparent"
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
                        className="w-32 bg-white border-0 rounded-lg px-3 py-2 text-xs text-center focus:ring-2 focus:ring-green-400 outline-none"
                      />
                    </div>

                    {/* Map View */}
                    <div className="flex flex-col items-center gap-2">
                      <label className="text-xs text-gray-600">Default Map View</label>
                      <select
                        value={preferences.mapView}
                        onChange={(e) => handlePreferenceChange('mapView', e.target.value)}
                        className="w-32 bg-white border-0 rounded-lg px-3 py-2 text-xs text-center focus:ring-2 focus:ring-green-400 outline-none"
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
                  <button className="w-full bg-black text-white py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                    Save changes
                  </button>
                  
                  <button className="w-full bg-black text-white py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}