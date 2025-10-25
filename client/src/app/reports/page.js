'use client';

import { useState, useEffect } from 'react';
import { LayoutDashboard, Home, FileText, MessageSquare, LogOut, User } from 'lucide-react';
import { generatePropertyReport } from '@/utils/reportGenerator';
import { reportAPI } from '@/lib/api';

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
      <NavIcon href="/reports" icon={FileText} label="Reports" active />
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

// Main Reports Page
export default function ReportsPage() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    fetchLatestReport();
  }, []);

  const fetchLatestReport = async () => {
    try {
      setLoading(true);
      const urlParams = new URLSearchParams(window.location.search);
      const propertyId = urlParams.get('propertyId') || 1;
      
      const data = await reportAPI.getPropertyReport(propertyId);
      setReportData(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch report:', err);
      setError('Failed to load report. Using sample data.');
      setReportData(getSampleData());
    } finally {
      setLoading(false);
    }
  };

  const getSampleData = () => ({
    property: {
      name: 'Kilimani Heights Apartments, Nairobi',
      address: 'Kilimani, Nairobi',
      latitude: -1.2921,
      longitude: 36.7819
    },
    flood_score: 60,
    heat_score: 75,
    drainage_score: 45,
    erosion_score: 30,
    overall_score: 52.5,
    ai_summary: `This property lies within an urban area experiencing moderate flood risk due to poor drainage systems and increased surface runoff.

- Flood Risk: Medium (urban flash flooding possible during heavy rains).
- Heat Risk: High — temperature extremes projected to rise 1.8 °C by 2050.
- Drainage: Poor, stormwater management systems are outdated.

AI Insight:
"Climate adaptation should focus on green roofing and permeable paving to mitigate heat and waterlogging impacts."`,
    recommendations: [
      'Install flood barriers and improve drainage systems',
      'Implement green roofing and reflective surfaces',
      'Upgrade stormwater management systems'
    ]
  });

  const handleExport = () => {
    if (!reportData) {
      alert('No report data available');
      return;
    }

    try {
      const propertyData = {
        name: reportData.property.name,
        address: reportData.property.address,
        latitude: reportData.property.latitude,
        longitude: reportData.property.longitude,
        property_type: reportData.property.property_type || 'Residential'
      };

      const riskData = {
        flood_score: reportData.flood_score,
        heat_score: reportData.heat_score,
        erosion_score: reportData.erosion_score,
        drainage_score: reportData.drainage_score,
        overall_score: reportData.overall_score,
        ai_summary: reportData.ai_summary,
        actions: reportData.recommendations
      };

      generatePropertyReport(propertyData, riskData);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export report. Please try again.');
    }
  };

  const handleReanalyze = async () => {
    if (!reportData?.property?.id) {
      alert('No property selected');
      return;
    }

    if (!confirm('Re-analyze this property? This will generate a new report.')) {
      return;
    }

    try {
      setIsAnalyzing(true);
      await reportAPI.generateReport(reportData.property.id);
      alert('Analysis completed! Refreshing report...');
      await fetchLatestReport();
    } catch (err) {
      console.error('Analysis failed:', err);
      alert('Failed to analyze property. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-white items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D5F3F] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  const data = reportData || getSampleData();

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      
      <div className="flex-1 ml-28">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#2D5F3F]">Reports</h2>
            {error && (
              <p className="text-sm text-orange-600 mt-1">⚠️ {error}</p>
            )}
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
          <div className="max-w-7xl mx-auto">
            
            {/* Property Info Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Property Info</h3>
              <h4 className="text-lg font-semibold text-gray-900">{data.property.name}</h4>
              <p className="text-sm text-gray-600 mt-1">
                Coordinates: {data.property.latitude}, {data.property.longitude}
              </p>
            </div>

            {/* Climate Risk & AI Summary */}
            <div className="grid grid-cols-2 gap-6">
              
              {/* Climate Risk Chart */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Climate Risk</h3>
                
                <div className="flex items-end justify-around h-64">
                  {/* Flood Bar */}
                  <div className="flex flex-col items-center">
                    <div 
                      className="w-20 bg-[#5DABBC] rounded-t-lg transition-all" 
                      style={{ height: `${(data.flood_score / 100) * 180}px` }}
                    ></div>
                    <p className="text-sm font-medium text-gray-700 mt-3">Flood</p>
                    <p className="text-xs text-gray-500">{data.flood_score}</p>
                  </div>
                  
                  {/* Heat Bar */}
                  <div className="flex flex-col items-center">
                    <div 
                      className="w-20 bg-[#FFB84D] rounded-t-lg transition-all" 
                      style={{ height: `${(data.heat_score / 100) * 180}px` }}
                    ></div>
                    <p className="text-sm font-medium text-gray-700 mt-3">Heat</p>
                    <p className="text-xs text-gray-500">{data.heat_score}</p>
                  </div>
                  
                  {/* Drainage Bar */}
                  <div className="flex flex-col items-center">
                    <div 
                      className="w-20 bg-[#7BC96F] rounded-t-lg transition-all" 
                      style={{ height: `${(data.drainage_score / 100) * 180}px` }}
                    ></div>
                    <p className="text-sm font-medium text-gray-700 mt-3">Drainage</p>
                    <p className="text-xs text-gray-500">{data.drainage_score}</p>
                  </div>
                </div>

                {/* Y-axis labels */}
                <div className="flex justify-between text-xs text-gray-500 mt-4 px-2">
                  <span>0</span>
                  <span>25</span>
                  <span>50</span>
                  <span>75</span>
                  <span>100</span>
                </div>
              </div>

              {/* AI Summary */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4">AI Summary</h3>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {data.ai_summary}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={handleExport}
                disabled={isAnalyzing}
                className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Export PDF
              </button>
              <button
                onClick={handleReanalyze}
                disabled={isAnalyzing}
                className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? 'Analyzing...' : 'Re-analyze'}
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}