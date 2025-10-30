'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Home, FileText, MessageSquare, LogOut, User, Send, Download, MapPin, CheckCircle, AlertCircle } from 'lucide-react';


const API_URL = "https://climascan.onrender.com";



const aiChatAPI = {
  sendMessage: async (message, history) => {
    const response = await fetch(`${API_URL}/api/ai/chat`, {
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
    const endpoint = `${API_URL}/api/reports/property/${propertyId}/generate`;
    console.log('🔍 Calling API:', endpoint);
    console.log('🔍 Property ID:', propertyId);
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers
    });
    
    console.log('🔍 Response status:', response.status);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('API Error:', error);
      throw new Error(error.error || 'Failed to generate report');
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    return data;
  }
};

const propertyAPI = {
  getAllProperties: async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}/api/properties/`, {
        method: 'GET',
        headers: headers
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      
      const data = await response.json();
      return data.properties || [];
    } catch (error) {
      console.error('Property fetch error:', error);
  
      return [
        { id: 1, name: 'Kilimani Heights, Nairobi', address: 'Kilimani, Nairobi' },
        { id: 2, name: 'Westlands Tower', address: 'Westlands, Nairobi' }
      ];
    }
  }
};


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
const Sidebar = ({ onLogout }) => (
  <div className="w-28 bg-[#F5F5F5] border-r border-gray-300 h-screen fixed left-0 top-0 flex flex-col items-center py-8">
    <Link href="/landing" className="mb-12 cursor-pointer hover:opacity-80 transition-opacity">
      <h1 className="text-lg font-bold text-center">
        <div className="text-[#2D5F3F]">Clima</div>
        <div className="text-[#5DABBC]">Scan</div>
      </h1>
    </Link>
    
    <nav className="flex-1 flex flex-col items-center space-y-6">
      <NavIcon href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
      <NavIcon href="/properties" icon={Home} label="Properties" />
      <NavIcon href="/reports" icon={FileText} label="Reports" />
      <NavIcon href="/ai-chat" icon={MessageSquare} label="AI Chat" active />
      <NavIcon href="/profile-settings" icon={User} label="Profile" />
    </nav>
    
    <div className="mt-auto">
      <button onClick={onLogout} className="flex flex-col items-center gap-2 p-3 rounded-lg transition-all text-gray-600 hover:text-[#2D5F3F] w-full">
        <LogOut className="w-6 h-6" />
        <span className="text-xs font-medium">Log Out</span>
      </button>
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


export default function AIChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchProperties = async () => {
    try {
      const data = await propertyAPI.getAllProperties();
      setProperties(data);
    } catch (err) {
      console.error('Failed to fetch properties:', err);
      setProperties([
        { id: 1, name: 'Kilimani Heights, Nairobi', address: 'Kilimani, Nairobi' },
        { id: 2, name: 'Westlands Tower', address: 'Westlands, Nairobi' }
      ]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      }));

      const response = await aiChatAPI.sendMessage(inputMessage, conversationHistory);
      
      const aiMessage = {
        id: Date.now() + 1,
        text: response.message || response.response || "I'm here to help with climate risk analysis. Could you provide more details?",
        isUser: false,
        timestamp: new Date(),
        propertyData: response.propertyData,
        reportGenerated: response.reportGenerated
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('AI chat error:', err);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I apologize, I'm having trouble processing that request. Please try again or rephrase your question.",
        isUser: false,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedProperty) {
      alert('Please select a property first');
      return;
    }

    setIsLoading(true);
    const reportRequestMsg = {
      id: Date.now(),
      text: `Generate a detailed climate risk report for ${selectedProperty.name}`,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, reportRequestMsg]);

    try {
      const reportData = await reportAPI.generateReport(selectedProperty.id);
      
      const reportMessage = {
        id: Date.now() + 1,
        text: `Climate Risk Report Generated!\n\nProperty: ${selectedProperty.name}\nOverall Risk Score: ${reportData.overall_score}%\n\n${reportData.ai_summary}\n\nThe report has been saved and is available in your Reports section.`,
        isUser: false,
        timestamp: new Date(),
        reportData: reportData,
        hasReport: true
      };

      setMessages(prev => [...prev, reportMessage]);
      
      setTimeout(() => {
        if (confirm('Report generated successfully! Would you like to view it now?')) {
          window.location.href = `/reports?propertyId=${selectedProperty.id}`;
        }
      }, 1000);
    } catch (err) {
      console.error('Report generation error:', err);
      const errorMsg = {
        id: Date.now() + 1,
        text: `Failed to generate report: ${err.message}. Please check that your backend server is running and try again.`,
        isUser: false,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportChat = () => {
    if (messages.length === 0) {
      alert('No conversation to export');
      return;
    }

    try {
      generateChatReport(messages);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export chat. Please try again.');
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar onLogout={handleLogout} />
      
      <div className="flex-1 ml-28">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#2D5F3F]">AI Climate Assistant</h2>
            <p className="text-sm text-gray-600 mt-1">Ask questions, analyze properties, and generate reports</p>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="/about" className="text-sm font-medium text-gray-600 hover:text-[#2D5F3F]">ABOUT</a>
            <a href="/contact" className="text-sm font-medium text-gray-600 hover:text-[#2D5F3F]">CONTACT</a>
            <a href="/profile-settings" className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5DABBC] to-[#2D5F3F] flex items-center justify-center text-white font-semibold hover:shadow-lg transition-shadow cursor-pointer">
              <User className="w-6 h-6" />
            </a>
          </div>
        </header>

        <main className="flex h-[calc(100vh-80px)]">
          <div className="w-80 border-r border-gray-200 bg-gray-50 p-6 overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Select Property</h3>
            
            <div className="space-y-3">
              {properties.map(property => (
                <div
                  key={property.id}
                  onClick={() => setSelectedProperty(property)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedProperty?.id === property.id
                      ? 'border-[#2D5F3F] bg-white shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <h4 className="font-semibold text-gray-900 text-sm">{property.name}</h4>
                  <p className="text-xs text-gray-600 mt-1">{property.address}</p>
                </div>
              ))}
            </div>

            {selectedProperty && (
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleGenerateReport}
                  disabled={isLoading}
                  className="w-full bg-[#2D5F3F] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#234a32] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  {isLoading ? 'Generating...' : 'Generate Report'}
                </button>

                <button
                  onClick={handleExportChat}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export Chat
                </button>
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-gray-700 leading-relaxed">
                💡 <strong>Tip:</strong> Select a property and ask specific questions like "What's the flood risk?" or click "Generate Report" for a full analysis.
              </p>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && <WelcomeMessage />}
              
             {!selectedProperty && messages.length > 0 && (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
    <p className="text-sm text-blue-800">
      💡 Select a property for personalized analysis, or continue with general questions
    </p>
  </div>
)}
              
              {messages.map(message => (
                <ChatMessage 
                  key={message.id}
                  message={message}
                  selectedProperty={selectedProperty}
                  onViewReport={(propertyId) => {
                    window.location.href = `/reports?propertyId=${propertyId}`;
                  }}
                />
              ))}

              {isLoading && <LoadingMessage />}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-200 p-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                 placeholder={selectedProperty ? `Ask about ${selectedProperty.name}...` : "Ask me about climate risks or general questions..."}
                 disabled={isLoading}
                  className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#5DABBC] focus:border-[#5DABBC] outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  onClick={handleSendMessage}
                 disabled={isLoading || !inputMessage.trim()}
                  className="bg-[#2D5F3F] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#234a32] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Press Enter to send • Shift+Enter for new line
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
