'use client';

import { ArrowRight, Shield, BarChart3, Brain, FileText, MapPin, Cloud } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-teal-50">
      
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">
              <span className="text-[#2D5F3F]">Clima</span>
              <span className="text-[#5DABBC]">Scan</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-[#2D5F3F] transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-[#2D5F3F] transition-colors">
              How It Works
            </a>
            <a href="#about" className="text-sm font-medium text-gray-600 hover:text-[#2D5F3F] transition-colors">
              About
            </a>
            <a 
              href="/login" 
              className="text-sm font-medium text-gray-600 hover:text-[#2D5F3F] transition-colors"
            >
              Login
            </a>
            <a 
              href="/signup" 
              className="bg-[#2D5F3F] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#234a32] transition-colors"
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 mb-6 shadow-sm">
            <Cloud className="w-4 h-4 text-[#5DABBC]" />
            <span className="text-sm font-medium text-gray-700">AI-Powered Climate Risk Intelligence</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Protect Your Property with
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#2D5F3F] to-[#5DABBC]">
              Climate Intelligence
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Analyze flood risks, heat stress, and environmental impacts for properties across Kenya. 
            Get AI-powered insights and actionable reports in minutes.
          </p>
          
          <div className="flex gap-4 justify-center">
            <a 
              href="/signup" 
              className="bg-[#2D5F3F] text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-[#234a32] transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              Start Free Analysis
              <ArrowRight className="w-5 h-5" />
            </a>
            <a 
              href="/dashboard" 
              className="bg-white text-gray-800 px-8 py-4 rounded-lg font-medium text-lg hover:bg-gray-50 transition-colors border border-gray-300 shadow-sm"
            >
              View Dashboard
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-[#2D5F3F]">1000+</div>
              <div className="text-sm text-gray-600 mt-1">Properties Analyzed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#5DABBC]">98%</div>
              <div className="text-sm text-gray-600 mt-1">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#2D5F3F]">24/7</div>
              <div className="text-sm text-gray-600 mt-1">AI Assistant</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Climate Risk Analysis
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to understand and mitigate climate risks for your properties
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#2D5F3F] rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Risk Assessment</h3>
              <p className="text-gray-600 leading-relaxed">
                Detailed analysis of flood risks, heat stress, drainage issues, and coastal erosion for any property in Kenya.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-teal-50 to-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#5DABBC] rounded-xl flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Insights</h3>
              <p className="text-gray-600 leading-relaxed">
                Chat with our AI assistant to get instant answers about climate risks and personalized recommendations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#2D5F3F] rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Professional Reports</h3>
              <p className="text-gray-600 leading-relaxed">
                Generate comprehensive PDF reports with risk scores, visualizations, and mitigation strategies.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-teal-50 to-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#5DABBC] rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Location Intelligence</h3>
              <p className="text-gray-600 leading-relaxed">
                Analyze multiple properties across Kenya with precise coordinate-based climate data analysis.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#2D5F3F] rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Visual Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Interactive charts and graphs that make complex climate data easy to understand and act upon.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-teal-50 to-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#5DABBC] rounded-xl flex items-center justify-center mb-4">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Data</h3>
              <p className="text-gray-600 leading-relaxed">
                Access up-to-date climate information and projections based on the latest scientific models.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-white to-green-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How ClimaScan Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get comprehensive climate risk analysis in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2D5F3F] to-[#5DABBC] rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Add Your Property</h3>
              <p className="text-gray-600">
                Enter your property location using coordinates or address. Our system supports properties across Kenya.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2D5F3F] to-[#5DABBC] rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Analysis</h3>
              <p className="text-gray-600">
                Our AI analyzes climate data, assesses risks, and generates insights specific to your property's location.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2D5F3F] to-[#5DABBC] rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Get Reports</h3>
              <p className="text-gray-600">
                Receive detailed reports with risk scores, visualizations, and actionable recommendations to protect your property.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#2D5F3F] to-[#5DABBC] py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Protect Your Property?
          </h2>
          <p className="text-xl text-white opacity-90 mb-10">
            Join hundreds of property owners using ClimaScan to make informed decisions about climate risks.
          </p>
          <div className="flex gap-4 justify-center">
            <a 
              href="/signup" 
              className="bg-white text-[#2D5F3F] px-8 py-4 rounded-lg font-medium text-lg hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-xl"
            >
              Start Your Free Analysis
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">
                <span className="text-[#2D5F3F]">Clima</span>
                <span className="text-[#5DABBC]">Scan</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered climate risk intelligence for properties across Kenya.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="/properties" className="hover:text-white transition-colors">Properties</a></li>
                <li><a href="/reports" className="hover:text-white transition-colors">Reports</a></li>
                <li><a href="/ai-chat" className="hover:text-white transition-colors">AI Chat</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Email</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 ClimaScan. All rights reserved. Built with ❤️ for Kenya.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}