"use client";

import { useEffect, useState } from "react";
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

const API_URL = "http://127.0.0.1:5000/api";

export default function ReportsPage() {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAllProperties = async () => {
      let allProps = [];
      let page = 1;
      let totalPages = 1;

      try {
        do {
          const res = await fetch(`${API_URL}/properties/?page=${page}&per_page=10`);
          if (!res.ok) throw new Error("Failed to load properties");
          const data = await res.json();

          if (data.properties && data.properties.length > 0) {
            allProps = [...allProps, ...data.properties];
            totalPages = data.pages;
            page += 1;
          } else {
            break;
          }
        } while (page <= totalPages);

        setProperties(allProps);
      } catch (error) {
        console.error("Error fetching all properties:", error);
      }
    };

    fetchAllProperties();
  }, []);



  const fetchReport = async (propertyId) => {
    if (!propertyId) return;
    setLoadingReport(true);
    try {
      const res = await fetch(`${API_URL}/reports/${propertyId}`);
      if (!res.ok) throw new Error("Failed to load report");
      const data = await res.json();
      setReportData(data);
      setMessage("");
    } catch (error) {
      console.error("Error fetching report:", error);
      setMessage("Failed to load report data.");
      setReportData(null);
    } finally {
      setLoadingReport(false);
    }
  };


  const handleReanalyze = async () => {
    if (!selectedProperty) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/reports/reanalyze/${selectedProperty.id}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Reanalysis failed");
      const data = await res.json();
      setReportData(data);
      setMessage("✅ Re-analysis complete!");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to re-analyze report");
    } finally {
      setLoading(false);
    }
  };


  const handleExport = async () => {
    if (!selectedProperty) return;
    try {
      const res = await fetch(`${API_URL}/reports/export/${selectedProperty.id}`);
      if (!res.ok) throw new Error("Export failed");
      const data = await res.json();
      setMessage(`📄 ${data.message}`);
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to export report");
    }
  };

  const chartData =
    reportData && [
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
          <div className="max-w-7xl mx-auto space-y-8">

            <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Select Property</h3>
              <select
                className="w-full border border-gray-300 rounded-lg p-2 text-gray-900 bg-white"
                value={selectedProperty?.id || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!value) {
                    setSelectedProperty(null);
                    setReportData(null);
                    return;
                  }
                  const property = properties.find(
                    (p) => p.id === parseInt(value)
                  );
                  if (property) {
                    setSelectedProperty(property);
                    fetchReport(property.id);
                  }
                }}
              >
                <option value="">-- Choose a property --</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.location})
                  </option>
                ))}
              </select>
            </section>


            {selectedProperty && reportData && (
              <>
                <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    Property Info
                  </h3>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {selectedProperty.name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Location: {selectedProperty.location}
                  </p>
                </section>


                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">
                      Climate Risk
                    </h3>
                    {loadingReport ? (
                      <p>Loading chart...</p>
                    ) : (
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
                    )}
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
                  <button
                    onClick={handleExport}
                    disabled={loading}
                    className="bg-black text-white px-10 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Exporting..." : "Export"}
                  </button>
                  <button
                    onClick={handleReanalyze}
                    disabled={loading}
                    className="bg-black text-white px-10 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Re-analyzing..." : "Re-analyze"}
                  </button>
                </div>
              </>
            )}

            {message && (
              <div className="text-center text-sm text-gray-600 mt-4">{message}</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
