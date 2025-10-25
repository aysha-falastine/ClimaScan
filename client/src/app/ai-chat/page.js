'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, LayoutDashboard, Home, FileText, MessageSquare, LogOut, Download, Trash2, User } from 'lucide-react';
import ChatMessage from '@/components/ChatMessage';
import OpenAI from 'openai';

// Debug logging
console.log("🔑 API Key Check:", process.env.NEXT_PUBLIC_OPENAI_API_KEY ? "✅ Found" : "❌ Missing");

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Sidebar Component
const Sidebar = () => (
  <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
    <div className="p-6">
      <h1 className="text-3xl font-bold">
        <span className="text-[#2D5F3F]">Clima</span>
        <span className="text-[#5DABBC]">Scan</span>
      </h1>
    </div>
    
    <nav className="flex-1 px-4 space-y-2">
      <NavLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
      <NavLink href="/properties" icon={Home} label="Properties" />
      <NavLink href="/reports" icon={FileText} label="Reports" />
      <NavLink href="/ai-chat" icon={MessageSquare} label="AI Assistant" active />
    </nav>
    
    <div className="p-4 border-t border-gray-200">
      <NavLink href="/logout" icon={LogOut} label="Log Out" />
    </div>
  </div>
);

const NavLink = ({ href, icon: Icon, label, active }) => (
  <a
    href={href}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
      active
        ? 'bg-[#E8F5E9] text-[#2D5F3F] font-semibold'
        : 'text-gray-600 hover:bg-gray-50'
    }`}
  >
    <Icon className={`w-5 h-5 ${active ? 'text-[#2D5F3F]' : 'text-gray-500'}`} />
    <span>{label}</span>
  </a>
);

// Main AI Chat Page
export default function AIChatPage() {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm ClimaScan AI. I can help you understand climate risks for properties including flood assessment, heat stress analysis, coastal erosion, and climate adaptation strategies. How can I assist you today?", 
      isUser: false, 
      timestamp: new Date().toISOString() 
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const suggestedQuestions = [
    "How should I assess flood risk for coastal properties?",
    "What are signs of poor drainage in a property?",
    "How does heat island effect impact buildings?",
    "What climate adaptations should I consider?"
  ];

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { 
      id: Date.now(), 
      text: input, 
      isUser: true, 
      timestamp: new Date().toISOString() 
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured. Please add NEXT_PUBLIC_OPENAI_API_KEY to your .env.local file.');
      }

      const conversationMessages = [
        {
          role: 'system',
          content: `You are ClimaScan AI, an expert climate risk assessment assistant. You help with:
- Flood risk and drainage analysis
- Heat stress and urban heat island effects
- Coastal erosion and sea level rise
- Climate adaptation strategies
- Property risk assessment

Provide clear, actionable advice in a professional yet friendly tone. Use bullet points for clarity when appropriate.`
        }
      ];

      messages
        .filter(msg => msg.id !== 1)
        .forEach(msg => {
          conversationMessages.push({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.text
          });
        });

      conversationMessages.push({
        role: 'user',
        content: currentInput
      });

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: conversationMessages,
        temperature: 0.7,
        max_tokens: 1000,
      });

      const aiResponseText = completion.choices[0].message.content;
      
      const aiResponse = { 
        id: Date.now() + 1, 
        text: aiResponseText, 
        isUser: false,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiResponse]);

    } catch (error) {
      console.error('OpenAI Error:', error);
      const errorMessage = { 
        id: Date.now() + 1, 
        text: error.message || "Sorry, I encountered an error. Please check your API key and try again.", 
        isUser: false,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedClick = (question) => {
    setInput(question);
  };

  const handleClearChat = () => {
    if (window.confirm('Clear this conversation?')) {
      setMessages([
        { 
          id: 1, 
          text: "Hello! I'm ClimaScan AI. I can help you understand climate risks for properties including flood assessment, heat stress analysis, coastal erosion, and climate adaptation strategies. How can I assist you today?", 
          isUser: false, 
          timestamp: new Date().toISOString() 
        },
      ]);
    }
  };

  const handleDownloadChat = () => {
    const transcript = messages.map(msg => {
      const time = new Date(msg.timestamp).toLocaleString();
      const sender = msg.isUser ? 'You' : 'ClimaScan AI';
      return `[${time}] ${sender}:\n${msg.text}\n`;
    }).join('\n');

    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ClimaScan_Chat_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-screen bg-[#F5F5F5]">
      <Sidebar />
      
      <div className="flex-1 ml-64 flex flex-col">
        {/* Top Header with Profile */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Ask AI</h2>
            <p className="text-sm text-gray-500 mt-1">
              Chat with ClimaScan AI about climate risk assessment
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome,</p>
              <p className="text-sm font-semibold text-gray-800">User</p>
            </div>
            <a 
              href="/profile-settings" 
              className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5DABBC] to-[#2D5F3F] flex items-center justify-center text-white font-semibold hover:shadow-lg transition-shadow cursor-pointer"
              title="Profile Settings"
            >
              <User className="w-6 h-6" />
            </a>
          </div>
        </header>

        {/* Action Buttons */}
        {messages.length > 1 && (
          <div className="bg-white border-b border-gray-100 px-8 py-3 flex justify-end gap-3">
            <button
              onClick={handleDownloadChat}
              className="flex items-center gap-2 px-4 py-2 text-sm text-[#2D5F3F] hover:bg-green-50 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={handleClearChat}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
          </div>
        )}

        {/* Chat Messages */}
        <main className="flex-1 overflow-y-auto p-8 space-y-4">
          {messages.map((msg) => (
            <ChatMessage 
              key={msg.id} 
              message={{ text: msg.text, timestamp: msg.timestamp }}
              isUser={msg.isUser} 
            />
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-2 shadow-sm">
                <Loader2 className="w-4 h-4 animate-spin text-[#2D5F3F]" />
                <span className="text-sm text-gray-700">ClimaScan is thinking...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </main>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="px-8 pb-4">
            <p className="text-xs text-gray-500 mb-3 font-medium">Suggested questions:</p>
            <div className="grid grid-cols-2 gap-3">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedClick(question)}
                  className="text-left text-sm bg-white border border-gray-200 hover:border-[#5DABBC] hover:bg-green-50 text-gray-700 px-4 py-3 rounded-lg transition-all shadow-sm"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <footer className="bg-white border-t border-gray-200 p-6">
          <form onSubmit={handleSend} className="flex items-center gap-3 max-w-5xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask ClimaScan AI..."
              className="flex-1 border border-gray-300 rounded-full py-3 px-6 text-sm focus:ring-2 focus:ring-[#5DABBC] focus:border-[#5DABBC] transition outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              className={`p-4 rounded-full text-white transition-all flex items-center justify-center ${
                isLoading || !input.trim()
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#2D5F3F] hover:bg-[#1f4429] shadow-lg hover:shadow-xl'
              }`}
              disabled={isLoading || !input.trim()}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
}