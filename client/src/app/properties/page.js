"use client";

import { useEffect, useState } from "react";
import { FiTrash2, FiEdit2 } from "react-icons/fi";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });
const API_URL = "http://localhost:5000/api/properties";

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", location: "", date_added: "" });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchProperties = async (query = "", pageNum = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?search=${query}&page=${pageNum}&per_page=5`);
      const data = await res.json();
      console.log("Fetched properties:", data);
      setProperties(data.properties || []);
      setPage(data.page);
      setTotalPages(data.pages);
      setTotalCount(data.total);
    } catch (err) {
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Fetching from:", `${API_URL}?search=${search}&page=${page}&per_page=5`);
    fetchProperties(search, page);
  }, [search, page]);

  const addOrUpdateProperty = async () => {
    if (!form.name || !form.location) return;
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          location: form.location,
          date_added: form.date_added,
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save property");
      }
      const updatedProp = await res.json();
      if (editingId) {
        setProperties((prev) =>
          prev.map((p) => (p.id === editingId ? updatedProp : p))
        );
        setEditingId(null);
      } else {
        setProperties((prev) => [updatedProp, ...prev]);
      }
      await fetchProperties(search, page);
      setForm({ name: "", location: "", date_added: "" });
    } catch (err) {
      console.error("Error saving property:", err);
    }
  };

  const deleteProperty = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete property");
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting property:", err);
    }
  };

  const startEditing = (property) => {
    setEditingId(property.id);
    setForm({
      name: property.name,
      location: property.location,
      date_added: property.date_added?.split("T")[0] || "",
    });
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="flex flex-col md:flex-row gap-10">
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-[#29572C] mb-8">Properties</h1>

        <div className="w-full max-w-lg mb-6">
          <input
            type="text"
            placeholder="Search property"
            value={search}
            onChange={handleSearch}
            className="w-full rounded-full border border-gray-300 py-2 px-5 text-sm placeholder-gray-500 text-gray-800 focus:outline-none focus:border-green-500 shadow-sm"
          />
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-700 text-sm border-b">
                <th className="py-3 px-6 font-medium">Name</th>
                <th className="py-3 px-6 font-medium">Location</th>
                <th className="py-3 px-6 font-medium">Date Added</th>
                <th className="py-3 px-6 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    Loading properties...
                  </td>
                </tr>
              ) : properties.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No properties found
                  </td>
                </tr>
              ) : (
                properties.map((p, index) => (
                  <tr
                    key={p.id}
                    className={`${index % 2 === 0 ? "bg-green-50" : "bg-green-100"
                      } hover:bg-green-200 transition-colors`}
                  >
                    <td className="py-3 px-6 text-sm text-gray-800">{p.name}</td>
                    <td className="py-3 px-6 text-sm text-gray-800">
                      {p.location}
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-800">
                      {p.date_added || "-"}
                    </td>
                    <td className="py-3 px-6 flex gap-4 text-gray-700">
                      <FiEdit2
                        onClick={() => startEditing(p)}
                        className="cursor-pointer hover:text-blue-600"
                      />
                      <FiTrash2
                        onClick={() => deleteProperty(p.id)}
                        className="cursor-pointer hover:text-red-600"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-center mt-6 gap-2">
          <div className="flex justify-center items-center gap-4">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className={`px-4 py-2 rounded-full border ${page <= 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
                }`}
            >
              Previous
            </button>
            <span className="text-gray-700 text-sm">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className={`px-4 py-2 rounded-full border ${page >= totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
                }`}
            >
              Next
            </button>
          </div>
          <p className="text-gray-500 text-sm">
            Showing {properties.length} of {totalCount} properties
          </p>
        </div>

        <div className="flex flex-col items-center mt-8 space-y-4">
          <div className="flex flex-wrap justify-center gap-6">
            <input
              type="text"
              placeholder="Property name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border border-gray-400 rounded-full px-5 py-2 bg-green-50 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-green-500"
            />
            <input
              type="text"
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="border border-gray-400 rounded-full px-5 py-2 bg-green-50 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-green-500"
            />
            <input
              type="date"
              value={form.date_added}
              onChange={(e) =>
                setForm({ ...form, date_added: e.target.value })
              }
              className="border border-gray-400 rounded-full px-5 py-2 bg-green-50 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-green-500"
            />
          </div>
          <button
            onClick={addOrUpdateProperty}
            className="mt-3 bg-black text-white px-8 py-2 rounded-full hover:bg-gray-800 transition"
          >
            {editingId ? "Update Property" : "+ Add New Property"}
          </button>
        </div>
      </div>

      <div className="w-full md:w-[420px] lg:w-[480px] h-[520px] rounded-2xl overflow-hidden shadow-lg border border-gray-300">
        <Map />
      </div>
    </div>
  );
}
