"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

export default function ReportsPage() {
  const [reportData] = useState({
    property: {
      name: "Kilimani Heights Apartments, Nairobi",
      coordinates: "-1.2921, 36.7819",
    },
    flood_score: 65,
    heat_score: 55,
    drainage_score: 70,
    ai_summary: `The property lies within an urban area experiencing moderate flood risk due to poor drainage systems and increased surface runoff.

- Flood Risk: Medium (urban flash flooding possible during heavy rains).
- Heat Risk: High — temperature extremes projected to rise 1.8 °C by 2050.
- Drainage: Poor, stormwater management systems are outdated.

AI Insight:
"Climate adaptation should focus on green roofing and permeable paving to mitigate heat and waterlogging impacts."`,
  });

  const chartData = [
    { name: "Flood", score: reportData.flood_score },
    { name: "Heat", score: reportData.heat_score },
    { name: "Drainage", score: reportData.drainage_score },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 ml-40">
        
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-green-800">Reports</h2>
        </header>

        <main className="p-8 overflow-y-auto h-[calc(100vh-80px)]">
          <div className="max-w-7xl mx-auto">
            
            <section className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Property Info
              </h3>
              <h4 className="text-lg font-semibold text-gray-900">
                {reportData.property.name}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Coordinates: {reportData.property.coordinates}
              </p>
            </section>

            
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Climate Risk
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar
                      dataKey="score"
                      fill="#16a34a"
                      radius={[8, 8, 0, 0]}
                      barSize={70}
                    >
                      <LabelList dataKey="score" position="top" fill="#111" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  AI Summary
                </h3>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {reportData.ai_summary}
                </div>
              </div>
            </section>

            
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