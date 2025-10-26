'use client';

import { useState, useEffect } from 'react';
import { LayoutDashboard, Home, FileText, MessageSquare, User, LogOut, Download, RefreshCw } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
      <NavIcon href="/reports" icon={FileText} label="Reports" active />
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

export default function ReportsPage() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [hoveredBar, setHoveredBar] = useState(null);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReportData({
        property: {
          name: 'Kilimani Heights Apartments, Nairobi',
          coordinates: '-1.2921, 36.7819'
        },
        flood_score: 65,
        heat_score: 55,
        drainage_score: 70,
        overall_score: 63,
        ai_summary: `The property lies within an urban area experiencing moderate flood risk due to poor drainage systems and increased surface runoff.

- Flood Risk: Medium (urban flash flooding possible during heavy rains).
- Heat Risk: High — temperature extremes projected to rise 1.8 °C by 2050.
- Drainage: Poor, stormwater management systems are outdated.

AI Insight:
"Climate adaptation should focus on green roofing and permeable paving to mitigate heat and waterlogging impacts."`
      });
    } catch (error) {
      console.error('Error fetching report:', error);
      alert('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!reportData) return;
    
    setExporting(true);
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFillColor(34, 197, 94);
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text('ClimaScan', 15, 20);
      doc.setFontSize(14);
      doc.text('Climate Risk Assessment Report', 15, 30);
      
      // Property Details
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('Property Information', 15, 55);
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text(`Property Name: ${reportData.property.name}`, 15, 65);
      doc.text(`Coordinates: ${reportData.property.coordinates}`, 15, 72);
      doc.text(`Assessment Date: ${new Date().toLocaleDateString()}`, 15, 79);
      
      // Risk Scores Table
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('Climate Risk Assessment', 15, 95);
      
      const tableData = [
        ['Risk Factor', 'Score', 'Level'],
        ['Flood Risk', reportData.flood_score, getRiskLevel(reportData.flood_score)],
        ['Heat Stress', reportData.heat_score, getRiskLevel(reportData.heat_score)],
        ['Drainage Issues', reportData.drainage_score, getRiskLevel(reportData.drainage_score)],
      ];
      
      doc.autoTable({
        startY: 105,
        head: [tableData[0]],
        body: tableData.slice(1),
        theme: 'grid',
        headStyles: { fillColor: [34, 197, 94] },
      });
      
      // Overall Score
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(`Overall Risk Score: ${reportData.overall_score}%`, 15, finalY);
      
      // AI Summary
      doc.setFontSize(16);
      doc.text('AI Risk Analysis', 15, finalY + 15);
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      const splitText = doc.splitTextToSize(reportData.ai_summary, 180);
      doc.text(splitText, 15, finalY + 25);
      
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text('© 2025 ClimaScan - Climate Risk Intelligence', 15, 285);
      
      // Download
      const filename = `ClimaScan_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
      alert('Report exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export report');
    } finally {
      setExporting(false);
    }
  };

  const handleReanalyze = async () => {
    if (!confirm('Re-analyze this property? This will generate a new report.')) return;
    
    setLoading(true);
    try {
      // Simulate API call to re-analyze
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update scores with slight variations
      setReportData(prev => ({
        ...prev,
        flood_score: Math.min(100, prev.flood_score + Math.floor(Math.random() * 10 - 5)),
        heat_score: Math.min(100, prev.heat_score + Math.floor(Math.random() * 10 - 5)),
        drainage_score: Math.min(100, prev.drainage_score + Math.floor(Math.random() * 10 - 5)),
      }));
      
      alert('Report re-analyzed successfully!');
    } catch (error) {
      console.error('Re-analyze error:', error);
      alert('Failed to re-analyze');
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevel = (score) => {
    if (score < 30) return 'Low';
    if (score < 60) return 'Medium';
    return 'High';
  };

  const chartHeight = 300;
  const maxScore = 100;

  if (loading && !reportData) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 ml-28 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-green-800 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading report...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 ml-28 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">No report available</p>
            <button onClick={fetchReport} className="mt-4 px-6 py-2 bg-green-800 text-white rounded-lg hover:bg-green-900">
              Load Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      
      <div className="flex-1 ml-28">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-green-800">Reports</h2>
          
          <div className="flex items-center gap-6">
            <a href="/about" className="text-sm font-medium text-gray-600 hover:text-green-800">ABOUT</a>
            <a href="/contact" className="text-sm font-medium text-gray-600 hover:text-green-800">CONTACT</a>
            <a href="/profile-settings" className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center hover:shadow-lg transition-shadow">
              <User className="w-5 h-5 text-white" />
            </a>
          </div>
        </header>

        <main className="p-8 overflow-y-auto h-[calc(100vh-80px)]">
          <div className="max-w-7xl mx-auto">
            
            {/* Property Info */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Property Info</h3>
              <h4 className="text-lg font-semibold text-gray-900">{reportData.property.name}</h4>
              <p className="text-sm text-gray-600 mt-1">Coordinates: {reportData.property.coordinates}</p>
            </div>

            {/* Climate Risk & AI Summary */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              
              {/* Climate Risk Chart */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Climate Risk</h3>
                
                <div className="relative">
                  <div className="flex items-end justify-around" style={{ height: `${chartHeight}px` }}>
                    
                    {/* Flood Bar */}
                    <div 
                      className="relative flex flex-col items-center cursor-pointer transition-all hover:opacity-80"
                      onMouseEnter={() => setHoveredBar('flood')}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      <div 
                        className="w-20 bg-blue-400 rounded-t-lg transition-all relative group" 
                        style={{ height: `${(reportData.flood_score / maxScore) * chartHeight}px` }}
                      >
                        {hoveredBar === 'flood' && (
                          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded text-sm whitespace-nowrap">
                            {reportData.flood_score}% - {getRiskLevel(reportData.flood_score)}
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-700 mt-3">Flood</p>
                    </div>
                    
                    {/* Heat Bar */}
                    <div 
                      className="relative flex flex-col items-center cursor-pointer transition-all hover:opacity-80"
                      onMouseEnter={() => setHoveredBar('heat')}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      <div 
                        className="w-20 bg-yellow-400 rounded-t-lg transition-all" 
                        style={{ height: `${(reportData.heat_score / maxScore) * chartHeight}px` }}
                      >
                        {hoveredBar === 'heat' && (
                          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded text-sm whitespace-nowrap">
                            {reportData.heat_score}% - {getRiskLevel(reportData.heat_score)}
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-700 mt-3">Heat</p>
                    </div>
                    
                    {/* Drainage Bar */}
                    <div 
                      className="relative flex flex-col items-center cursor-pointer transition-all hover:opacity-80"
                      onMouseEnter={() => setHoveredBar('drainage')}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      <div 
                        className="w-20 bg-green-400 rounded-t-lg transition-all" 
                        style={{ height: `${(reportData.drainage_score / maxScore) * chartHeight}px` }}
                      >
                        {hoveredBar === 'drainage' && (
                          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded text-sm whitespace-nowrap">
                            {reportData.drainage_score}% - {getRiskLevel(reportData.drainage_score)}
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-700 mt-3">Drainage</p>
                    </div>

                    {/* Curved Line */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <path
                        d={`M 60 ${chartHeight - (reportData.flood_score / maxScore) * chartHeight} 
                            Q 150 ${chartHeight - ((reportData.flood_score + reportData.heat_score) / 2 / maxScore) * chartHeight - 20}, 
                            240 ${chartHeight - (reportData.heat_score / maxScore) * chartHeight}
                            Q 300 ${chartHeight - ((reportData.heat_score + reportData.drainage_score) / 2 / maxScore) * chartHeight - 10},
                            360 ${chartHeight - (reportData.drainage_score / maxScore) * chartHeight}`}
                        stroke="#f97316"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <div className="flex justify-between text-xs text-gray-500 mt-4 px-2">
                    <span>0</span>
                    <span>25</span>
                    <span>50</span>
                    <span>75</span>
                    <span>100</span>
                  </div>
                </div>
              </div>

              {/* AI Summary */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4">AI Summary</h3>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {reportData.ai_summary}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <button 
                onClick={handleExport}
                disabled={exporting || loading}
                className="bg-black text-white px-10 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                {exporting ? 'Exporting...' : 'Export'}
              </button>
              <button 
                onClick={handleReanalyze}
                disabled={loading}
                className="bg-black text-white px-10 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Re-analyzing...' : 'Re-analyze'}
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}