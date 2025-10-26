'use client';

import { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Home, FileText, MessageSquare, LogOut, User, Send, Download, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

// API Configuration
const API_BASE_URL = 'http://127.0.0.1:5000/api';

// API Service Functions
const aiChatAPI = {
  sendMessage: async (message, history) => {
    const response = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send message');
    }
    
    const data = await response.json();
    return data.data || data;
  }
};

const reportAPI = {
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

const propertyAPI = {
  getAllProperties: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/properties`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Property fetch error:', error);
      // Return mock data if API fails
      return [
        { id: 1, name: 'Kilimani Heights, Nairobi', address: 'Kilimani, Nairobi' },
        { id: 2, name: 'Westlands Tower', address: 'Westlands, Nairobi' }
      ];
    }
  }
};

// Utility function for chat export
const generateChatReport = (messages) => {
  const chatContent = messages.map(msg => 
    `${msg.isUser ? 'You' : 'ClimaScan AI'} (${new Date(msg.timestamp).toLocaleString()}):\n${msg.text}\n`
  ).join('\n---\n\n');
  
  const blob = new Blob([chatContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `climascan-chat-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

// ChatMessage Component
const ChatMessage = ({ message, onViewReport, selectedProperty }) => {
  const {
    text,
    isUser,
    timestamp,
    isError,
    hasReport,
    reportData,
    propertyData
  } = message;

  const formatTime = (date) => {
    if (!date) return '';
    const messageDate = new Date(date);
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageBgColor = () => {
    if (isUser) return 'bg-[#2D5F3F] text-white';
    if (isError) return 'bg-red-50 text-red-900 border border-red-200';
    return 'bg-gray-100 text-gray-900';
  };

  const getAlignment = () => isUser ? 'justify-end' : 'justify-start';

  return (
    <div className={`flex ${getAlignment()}`}>
      <div className={`max-w-2xl px-4 py-3 rounded-lg shadow-sm ${getMessageBgColor()}`}>
        <div className="text-sm whitespace-pre-line leading-relaxed">{text}</div>

        {propertyData && !isUser && (
          <div className="mt-3 p-3 bg-white bg-opacity-20 rounded-md border border-white border-opacity-30">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <p className="font-semibold">{propertyData.name}</p>
                <p className="opacity-80 mt-0.5">{propertyData.address}</p>
              </div>
            </div>
          </div>
        )}

        {reportData && hasReport && !isUser && (
          <div className="mt-3 p-3 bg-white bg-opacity-20 rounded-md border border-white border-opacity-30">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs font-semibold">Report Generated</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="opacity-70">Overall Score</p>
                <p className="font-bold text-base">{reportData.overall_score}%</p>
              </div>
              <div>
                <p className="opacity-70">Risk Level</p>
                <p className="font-bold text-base">
                  {reportData.overall_score < 30 ? 'Low' : reportData.overall_score < 60 ? 'Medium' : 'High'}
                </p>
              </div>
            </div>
          </div>
        )}

        {isError && (
          <div className="flex items-center gap-2 mt-2 text-xs">
            <AlertCircle className="w-4 h-4" />
            <span className="font-medium">Error processing request</span>
          </div>
        )}

        <div className="flex items-center justify-between mt-3 pt-2 border-t border-current border-opacity-20">
          <p className="text-xs opacity-70">{formatTime(timestamp)}</p>
          {hasReport && selectedProperty && (
            <button
              onClick={() => onViewReport?.(selectedProperty.id)}
              className="text-xs font-medium underline hover:no-underline flex items-center gap-1 opacity-90 hover:opacity-100 transition-opacity"
            >
              <FileText className="w-3 h-3" />
              View Full Report
            </button>
          )}
        </div>

        {!isUser && (
          <div className="flex items-center gap-1 mt-2 text-xs opacity-70">
            <div className="w-2 h-2 bg-current rounded-full"></div>
            <span>ClimaScan AI</span>
          </div>
        )}
      </div>
    </div>
  );
};

// LoadingMessage Component
const LoadingMessage = () => (
  <div className="flex justify-start">
    <div className="bg-gray-100 px-4 py-3 rounded-lg shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
      <p className="text-xs text-gray-500 mt-2">AI is thinking...</p>
    </div>
  </div>
);

// WelcomeMessage Component
const WelcomeMessage = () => (
  <div className="flex justify-center py-8">
    <div className="max-w-md text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-[#5DABBC] to-[#2D5F3F] rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">🌍</span>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">Welcome to ClimaScan AI</h3>
      <p className="text-sm text-gray-600 leading-relaxed">
        I can help you analyze climate risks for your properties. Select a property from the sidebar and ask me about flood risks, heat stress, drainage issues, or request a detailed climate report.
      </p>
      <div className="mt-6 space-y-2 text-left bg-gray-50 p-4 rounded-lg">
        <p className="text-xs font-semibold text-gray-700 mb-2">Try asking:</p>
        <div className="space-y-1.5">
          <div className="text-xs text-gray-600 flex items-start gap-2">
            <span className="text-[#2D5F3F]">•</span>
            <span>"What's the flood risk for this property?"</span>
          </div>
          <div className="text-xs text-gray-600 flex items-start gap-2">
            <span className="text-[#2D5F3F]">•</span>
            <span>"How does heat stress affect this location?"</span>
          </div>
          <div className="text-xs text-gray-600 flex items-start gap-2">
            <span className="text-[#2D5F3F]">•</span>
            <span>"Generate a full climate risk report"</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

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
      <NavIcon href="/ai-chat" icon={MessageSquare} label="AI Chat" active />
      <NavIcon href="/profile-settings" icon={User} label="Profile" />
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

// Main AI Chat Page
export default function AIChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  