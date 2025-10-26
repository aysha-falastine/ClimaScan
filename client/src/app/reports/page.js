'use client';

import { useState, useEffect } from 'react';
import { LayoutDashboard, Home, FileText, User, LogOut } from 'lucide-react';

const Sidebar = () => (
  <div className="w-40 bg-gray-100 border-r border-gray-300 h-screen fixed left-0 top-0 flex flex-col items-center py-8">
    <div className="mb-12">
      <h1 className="text-xl font-bold text-center">
        <span className="text-green-800">Clima</span>
        <span className="text-teal-500">Scan</span>
      </h1>
    </div>
    
    <nav className="flex-1 flex flex-col items-center space-y-6">
      <NavIcon icon={LayoutDashboard} label="Dashboard" />
      <NavIcon icon={Home} label="Properties" />
      <NavIcon icon={FileText} label="Reports" active />
    </nav>
    
    <div className="mt-auto">
      <NavIcon icon={LogOut} label="Log Out" />
    </div>
  </div>
);

const NavIcon = ({ icon: Icon, label, active }) => (
  <button className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
    active ? 'text-green-800' : 'text-gray-600 hover:text-green-800'
  }`}>
    <Icon className="w-6 h-6" />
    <span className="text-xs font-medium">{label}</span>
  </button>
);

export default function ReportsPage() {
  const [reportData] = useState({
    property: {
      name: 'Kilimani Heights Apartments, Nairobi',
      coordinates: '-1.2921, 36.7819'
    },
    flood_score: 65,
    heat_score: 55,
    drainage_score: 70,
    ai_summary: `The property lies within an urban area experiencing moderate flood risk due to poor drainage systems and increased surface runoff.

- Flood Risk: Medium (urban flash flooding possible during heavy rains).
- Heat Risk: High — temperature extremes projected to rise 1.8 °C by 2050.
- Drainage: Poor, stormwater management systems are outdated.

AI Insight:
"Climate adaptation should focus on green roofing and permeable paving to mitigate heat and waterlogging impacts."`
  });

  const maxScore = 100;
  const chartHeight = 200;

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      
      <div className="flex-1 ml-40">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-green-800">Reports</h2>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-green-800">ABOUT</a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-green-800">CONTACT</a>
            <button className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-green-700 flex items-center justify-center hover:shadow-lg transition-shadow">
              <User className="w-5 h-5 text-white" />
            </button>
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
                  {/* Chart Container */}
                  <div className="flex items-end justify-around h-64 relative">
                    
                    {/* Flood Bar */}
                    <div className="flex flex-col items-center relative z-10">
                      <div 
                        className="w-20 bg-blue-400 rounded-t-lg transition-all" 
                        style={{ height: `${(reportData.flood_score / maxScore) * chartHeight}px` }}
                      ></div>
                      <p className="text-sm font-medium text-gray-700 mt-3">Flood</p>
                    </div>
                    
                    {/* Heat Bar */}
                    <div className="flex flex-col items-center relative z-10">
                      <div 
                        className="w-20 bg-yellow-400 rounded-t-lg transition-all" 
                        style={{ height: `${(reportData.heat_score / maxScore) * chartHeight}px` }}
                      ></div>
                      <p className="text-sm font-medium text-gray-700 mt-3">Heat</p>
                    </div>
                    
                    {/* Drainage Bar */}
                    <div className="flex flex-col items-center relative z-10">
                      <div 
                        className="w-20 bg-green-400 rounded-t-lg transition-all" 
                        style={{ height: `${(reportData.drainage_score / maxScore) * chartHeight}px` }}
                      ></div>
                      <p className="text-sm font-medium text-gray-700 mt-3">Drainage</p>
                    </div>

                    {/* Curved Line Overlay */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ top: '-10px' }}>
                      <path
                        d={`M 60 ${chartHeight - (reportData.flood_score / maxScore) * chartHeight + 10} 
                            Q 150 ${chartHeight - ((reportData.flood_score + reportData.heat_score) / 2 / maxScore) * chartHeight - 20}, 
                            240 ${chartHeight - (reportData.heat_score / maxScore) * chartHeight + 10}
                            Q 300 ${chartHeight - ((reportData.heat_score + reportData.drainage_score) / 2 / maxScore) * chartHeight - 10},
                            360 ${chartHeight - (reportData.drainage_score / maxScore) * chartHeight + 10}`}
                        stroke="#f97316"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  {/* Y-axis scale */}
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
              <button className="bg-black text-white px-10 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                Export
              </button>
              <button className="bg-black text-white px-10 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                Re-analyze
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}