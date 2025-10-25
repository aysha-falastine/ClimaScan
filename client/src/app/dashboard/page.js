
"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser({ username: "Asha" });
    }


    const fetchDashboard = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/dashboard");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p className="p-10 text-gray-500">Loading dashboard...</p>;
  if (!data || !user) return <p className="p-10 text-red-500">Failed to load data.</p>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Hi, {user.username} 👋</h1>
      </header>

      <div className="flex flex-col items-center justify-center text-center">
        <img
          src="/visual.svg"
          alt="Dashboard visual"
          className="w-40 h-40 mb-6 opacity-80"
        />
        <h2 className="text-xl font-semibold mb-2">
          Welcome, {user.username} 🌤
        </h2>
        <p className="text-black mb-6">
          Here’s an overview of your climate data and activity this year.
        </p>
        <button
          onClick={() => router.push("/properties")}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Add Property
        </button>


        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 w-full max-w-3xl">
          <div className="p-4 bg-white shadow rounded-lg text-center border border-gray-200">
            <p className="text-sm text-gray-600">Total Properties</p>
            <p className="text-2xl font-bold text-green-700">{data.total_properties}</p>
          </div>
          <div className="p-4 bg-white shadow rounded-lg text-center border border-gray-200">
            <p className="text-sm text-gray-600">Reports Generated</p>
            <p className="text-2xl font-bold text-blue-700">—</p>
          </div>
          <div className="p-4 bg-white shadow rounded-lg text-center border border-gray-200">
            <p className="text-sm text-gray-600">High-Risk Properties</p>
            <p className="text-2xl font-bold text-red-600">—</p>
          </div>
          <div className="p-4 bg-white shadow rounded-lg text-center border border-gray-200">
            <p className="text-sm text-gray-600">Average Risk</p>
            <p className="text-2xl font-bold text-yellow-600">—</p>
          </div>
        </div>
      </div>


      <div className="mt-16 grid md:grid-cols-2 gap-8 w-full max-w-5xl mx-auto">
        {/* Properties Chart */}
        <div className="bg-white p-6 shadow rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Properties Added per Month</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.monthly_properties}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#16a34a" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>


        <div className="bg-white p-6 shadow rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Reports Generated per Month</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { month: "Jan", count: 1 },
                { month: "Feb", count: 2 },
                { month: "Mar", count: 0 },
                { month: "Apr", count: 3 },
                { month: "May", count: 1 },
                { month: "Jun", count: 2 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
