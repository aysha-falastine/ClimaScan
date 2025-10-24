"use client";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {

      setUser({ username: "User" });
    }


    setData(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6">

      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">
          Hi, {user?.username || "User"} 👋
        </h1>

      </header>


      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <img
          src="/visual.svg"
          alt="Empty dashboard"
          className="w-40 h-40 mb-6 opacity-80"
        />
        <h2 className="text-xl font-semibold mb-2">
          Welcome, {user?.username || "User"} 🌤
        </h2>
        <p className="text-gray-500 mb-6">
          Your dashboard is empty — start by adding your first property to get climate insights!
        </p>
        <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
          + Add Property
        </button>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 w-full max-w-3xl">
          {["Total Properties", "Reports Generated", "High-Risk Properties", "Average Risk"].map(
            (label, i) => (
              <div
                key={i}
                className="p-4 bg-white shadow rounded-lg text-center border border-gray-100"
              >
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-xl font-bold text-gray-400">—</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
