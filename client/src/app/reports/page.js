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

const API_URL = "https://climascan.onrender.com";


export default function ReportsPage() {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [message, setMessage] = useState("");
  const [aiSource, setAiSource] = useState(null);

  // Get JWT token from localStorage (or your storage method).
  // Login flow stores the token under the key 'token', but some places may use 'access_token'.
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token") || localStorage.getItem("access_token")
      : null;

  // Fetch all properties for the user
  useEffect(() => {
    const fetchAllProperties = async () => {
      let allProps = [];
      let page = 1;
      let totalPages = 1;

      try {
        do {
          const res = await fetch(`${API_URL}/api/properties/?page=${page}&per_page=10`, {
            headers: { Authorization: `Bearer ${token}` },
          });
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
        console.error("Property fetch error:", error);
      }
    };

    if (token) fetchAllProperties();
  }, [token]);

  // Fetch report for selected property
  const fetchReport = async (propertyId) => {
    if (!propertyId || !token) return;
    setLoadingReport(true);
    try {
      const res = await fetch(`${API_URL}/api/reports/property/${propertyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load report");
      const data = await res.json();
      if (data.reports && data.reports.length > 0) {
        setReportData(data.reports[0]); // pick latest report
        setAiSource(data.reports[0].ai_source || null);
      } else {
        setReportData(null);
        setAiSource(null);
      }
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
    if (!selectedProperty || !reportData || !token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/reports/${reportData.id}/re-analyze`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Reanalysis failed");
  const data = await res.json();
  setReportData(data.report);
  setAiSource(data.report.ai_source || null);
      setMessage("✅ Re-analysis complete!");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to re-analyze report");
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    if (!selectedProperty || !token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/reports/property/${selectedProperty.id}/generate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Generate failed");
      const data = await res.json();
      setReportData(data.report);
      setAiSource(data.report.ai_source || null);
      setMessage("✅ Report generated");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!selectedProperty || !reportData || !token) return;
    try {
      const res = await fetch(`${API_URL}/api/reports/${reportData.id}/export`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `climate_report_${selectedProperty.name}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setMessage(`📄 Report exported`);
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
      {/* Sidebar placeholder (AI Chat included elsewhere) */}
      <div className="flex-1 ml-40">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-green-800">Reports</h2>
        </header>

        <main className="p-8 overflow-y-auto h-[calc(100vh-80px)]">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Property selector */}
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
                  const property = properties.find((p) => p.id === parseInt(value));
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

            {/* Report display */}
                {selectedProperty && reportData && (
              <>
                <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Property Info</h3>
                  <h4 className="text-lg font-semibold text-gray-900">{selectedProperty.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">Location: {selectedProperty.location}</p>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Climate Risk</h3>
                    {loadingReport ? (
                      <p>Loading chart...</p>
                    ) : (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Bar dataKey="score" fill="#16a34a" radius={[8, 8, 0, 0]} barSize={70}>
                            <LabelList dataKey="score" position="top" fill="#111" />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">AI Summary</h3>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line flex-1">
                        {reportData.ai_summary}
                      </div>
                      <div className="ml-4">
                        {aiSource === 'hf' && (
                          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">AI: Live</span>
                        )}
                        {aiSource === 'fallback' && (
                          <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">AI: Fallback</span>
                        )}
                      </div>
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

            {/* If a property is selected but there is no report yet, allow generating one */}
            {selectedProperty && !reportData && (
              <div className="flex justify-center">
                <button
                  onClick={generateReport}
                  disabled={loading}
                  className="bg-black text-white px-10 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {loading ? "Generating..." : "Generate Report"}
                </button>
              </div>
            )}

            {message && <div className="text-center text-sm text-gray-600 mt-4">{message}</div>}
          </div>
        </main>
      </div>
    </div>
  );
}
