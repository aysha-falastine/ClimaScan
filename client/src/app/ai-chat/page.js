'use client';

import { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Home, FileText, MessageSquare, User, LogOut, Send } from 'lucide-react';

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
      <NavIcon href="/ai-chat" icon={MessageSquare} label="AI Chat" active />
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

export default function AIChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [properties] = useState([
    { id: 1, name: 'Kilimani Heights, Nairobi', address: 'Kilimani, Nairobi' },
    { id: 2, name: 'Westlands Tower', address: 'Westlands, Nairobi' }
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    if (!selectedProperty) {
      alert('Please select a property first');
      return;
    }

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

      const response = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          history: conversationHistory,
          property: selectedProperty
        })
      });

      if (!response.ok) throw new Error('Failed to get AI response');

      const data = await response.json();
      
      const aiMessage = {
        id: Date.now() + 1,
        text: data.data?.response || data.response || "I'm here to help with climate risk analysis.",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I apologize, I'm having trouble processing that request. Please try again.",
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
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      
      <div className="flex-1 ml-28">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-green-800">AI Climate Assistant</h2>
            <p className="text-sm text-gray-600 mt-1">Ask questions, analyze properties, and generate reports</p>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="/about" className="text-sm font-medium text-gray-600 hover:text-green-800">ABOUT</a>
            <a href="/contact" className="text-sm font-medium text-gray-600 hover:text-green-800">CONTACT</a>
            <a href="/profile-settings" className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center hover:shadow-lg transition-shadow">
              <User className="w-5 h-5 text-white" />
            </a>
          </div>
        </header>

        <main className="flex h-[calc(100vh-80px)]">
          {/* Property Selection Sidebar */}
          <div className="w-80 border-r border-gray-200 bg-gray-50 p-6 overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Select Property</h3>
            
            <div className="space-y-3">
              {properties.map(property => (
                <div
                  key={property.id}
                  onClick={() => setSelectedProperty(property)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedProperty?.id === property.id
                      ? 'border-green-800 bg-white shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <h4 className="font-semibold text-gray-900 text-sm">{property.name}</h4>
                  <p className="text-xs text-gray-600 mt-1">{property.address}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-gray-700 leading-relaxed">
                💡 <strong>Tip:</strong> Select a property and ask specific questions like "What's the flood risk?" or request a detailed climate report.
              </p>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="flex justify-center py-8">
                  <div className="max-w-md text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🌍</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Welcome to ClimaScan AI</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      I can help you analyze climate risks for your properties. Select a property from the sidebar and ask me about flood risks, heat stress, drainage issues, or request a detailed climate report.
                    </p>
                    <div className="mt-6 space-y-2 text-left bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Try asking:</p>
                      <div className="space-y-1.5">
                        <div className="text-xs text-gray-600">• "What's the flood risk for this property?"</div>
                        <div className="text-xs text-gray-600">• "How does heat stress affect this location?"</div>
                        <div className="text-xs text-gray-600">• "Generate a full climate risk report"</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!selectedProperty && messages.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Please select a property to get personalized climate risk analysis
                  </p>
                </div>
              )}
              
              {messages.map(message => (
                <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-2xl px-4 py-3 rounded-lg shadow-sm ${
                    message.isUser 
                      ? 'bg-green-800 text-white' 
                      : message.isError 
                      ? 'bg-red-50 text-red-900 border border-red-200'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="text-sm whitespace-pre-line leading-relaxed">{message.text}</div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-current border-opacity-20">
                      <p className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {!message.isUser && (
                      <div className="flex items-center gap-1 mt-1 text-xs opacity-70">
                        <div className="w-2 h-2 bg-current rounded-full"></div>
                        <span>ClimaScan AI</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
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
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={selectedProperty ? `Ask about ${selectedProperty.name}...` : "Select a property to start chatting..."}
                  disabled={isLoading || !selectedProperty}
                  className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim() || !selectedProperty}
                  className="bg-green-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-900 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
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