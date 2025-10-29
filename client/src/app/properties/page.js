"use client";

import { useEffect, useState, useRef } from "react";
import { FiTrash2, FiEdit2 } from "react-icons/fi";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-500">Loading map...</div>
});
const API_URL = "http://127.0.0.1:5000/api/properties/";


const getToken = () => localStorage.getItem("token");

const fetchProperties = async (query = "", pageNum = 1) => {
  setLoading(true);
  try {
    const res = await fetch(`${API_URL}/?search=${query}&page=${pageNum}&per_page=5`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,

      },
    });

    if (!res.ok) throw new Error(`Failed to fetch properties (status ${res.status})`);

    const data = await res.json();
    console.log("Data fetched:", data);
    setProperties(data.properties || []);
  } catch (err) {
    console.error(" Error fetching properties:", err);
  } finally {
    setLoading(false);
  }
};


export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", location: "", date_added: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [perPage, setPerPage] = useState(5);
  const router = useRouter();

  const handleUnauthorized = () => {
    try {
      localStorage.removeItem("token");
    } catch (e) {
      // ignore
    }
    // Redirect to login
    router.push("/login");
  };

  const fetchProperties = async (query = "", pageNum = 1) => {
    setLoading(true);
    setError(null);

    const token = getToken();
    if (!token) {
      const msg = "Missing authentication token. Please log in.";
      setError(msg);
      setLoading(false);

      setProperties([]);
      setPage(1);
      setTotalPages(1);
      setTotalCount(0);
      return { properties: [], page: 1, pages: 1, total: 0 };
    }


    const params = new URLSearchParams();
    if (query) params.set("search", query);
    params.set("page", pageNum);
    params.set("per_page", perPage);

    const url = `${API_URL}?${params.toString()}`;

    try {

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;


      const { authFetch } = await import("@/lib/fetcher");
      const res = await authFetch(url, {
        method: "GET",
        mode: "cors",
        signal: controller.signal,
      });

      if (res.status === 401) {
        handleUnauthorized();
        throw new Error("Unauthorized");
      }

      if (!res.ok) {

        let errMsg = `Failed to fetch properties (status ${res.status})`;
        try {
          const body = await res.json();
          if (body && (body.error || body.message)) errMsg = body.error || body.message;
        } catch (e) {

        }
        throw new Error(errMsg);
      }

      const data = await res.json();
      const out = {
        properties: data.properties || [],
        page: data.page || 1,
        pages: data.pages || 1,
        total: data.total || 0,
      };


      setProperties(out.properties);
      setPage(out.page);
      setTotalPages(out.pages);
      setTotalCount(out.total);

      return out;
    } catch (err) {

      if (err && err.name === "AbortError") {
        return { properties: [], page: 1, pages: 1, total: 0 };
      }

      console.error("Error fetching properties:", err);
      const isNetwork = err instanceof TypeError || /Failed to fetch/i.test(err.message);
      const message = isNetwork
        ? "Network or CORS error while fetching properties. Ensure the backend allows CORS and is running on http://127.0.0.1:5000"
        : err.message || "Failed to fetch properties";

      setError(message);


      setProperties([]);
      setPage(1);
      setTotalPages(1);
      setTotalCount(0);

      return { properties: [], page: 1, pages: 1, total: 0 };
    } finally {
      setLoading(false);

      abortControllerRef.current = null;
    }
  };

  useEffect(() => {
    fetchProperties(search, page);
  }, [search, page, perPage]);


  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        try {
          abortControllerRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  const addOrUpdateProperty = async () => {
    if (!form.name || !form.location) return;

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}${editingId}` : API_URL;

    try {
      const { authFetch } = await import("@/lib/fetcher");
      const res = await authFetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          location: form.location,
          date_added: form.date_added,
        }),
      });

      if (res.status === 401) {
        handleUnauthorized();
        throw new Error("Unauthorized");
      }

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || error.message || "Failed to save property");
      }

      await res.json();
      setForm({ name: "", location: "", date_added: "" });
      setEditingId(null);
      fetchProperties("", 1);
      setPage(1);
    } catch (err) {
      console.error("Error saving property:", err);
      setError(err.message || "Failed to save property");
    }
  };

  const deleteProperty = async (id) => {
    try {
      const { authFetch } = await import("@/lib/fetcher");
      const res = await authFetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (res.status === 401) {
        handleUnauthorized();
        throw new Error("Unauthorized");
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || body.message || "Failed to delete property");
      }

      fetchProperties(search, page);
    } catch (err) {
      console.error("Error deleting property:", err);
      setError(err.message || "Failed to delete property");
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

  return (
    <div className="flex flex-col md:flex-row gap-10 p-6">

      <div className="flex-1">
        <h1 className="text-3xl font-bold text-[#29572C] mb-6">Properties</h1>


        <input
          type="text"
          placeholder="Search property"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full max-w-md rounded-full border border-gray-300 py-2 px-5 text-sm mb-4 placeholder-gray-500"
        />


        {error && (
          <div role="alert" aria-live="assertive" className="mb-4 p-3 rounded border border-red-200 bg-red-50 text-red-800 flex items-start justify-between">
            <div className="text-sm">{error}</div>
            <button
              onClick={() => setError(null)}
              className="ml-4 text-sm font-medium underline"
            >
              Dismiss
            </button>
          </div>
        )}


        <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-100">
          <table className="w-full text-left border-collapse text-gray-800">
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
                <tr><td colSpan="4" className="text-center py-6">Loading...</td></tr>
              ) : properties.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-6">No properties found</td></tr>
              ) : (
                properties.map((p, i) => (
                  <tr key={p.id} className={`${i % 2 === 0 ? "bg-green-50" : "bg-green-100"} hover:bg-green-200`}>
                    <td className="py-3 px-6">{p.name}</td>
                    <td className="py-3 px-6">{p.location}</td>
                    <td className="py-3 px-6">{p.date_added || "-"}</td>
                    <td className="py-3 px-6 flex gap-3">
                      <FiEdit2 onClick={() => startEditing(p)} className="cursor-pointer hover:text-blue-600" />
                      <FiTrash2 onClick={() => deleteProperty(p.id)} className="cursor-pointer hover:text-red-600" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>


        <div className="flex items-center justify-between mt-4 max-w-md">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 rounded-full bg-green-600 text-white disabled:bg-gray-300"
          >
            Previous
          </button>
          <div className="flex items-center gap-4">
            <span>Page {page} of {totalPages}</span>
            <label className="text-sm text-gray-600">Per page:
              <select
                value={perPage}
                onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
                className="ml-2 rounded border-gray-300"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </label>
          </div>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 rounded-full bg-green-600 text-white disabled:bg-gray-300"
          >
            Next
          </button>
        </div>


        <div className="flex flex-wrap gap-3 mt-6 max-w-lg">
          <input
            type="text"
            placeholder="Property name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="px-4 py-2 rounded-full border border-gray-600 bg-green-50 text-gray-800 placeholder-gray-500"
          />
          <input
            type="text"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="px-4 py-2 rounded-full border border-gray-600 bg-green-50 text-gray-800 placeholder-gray-500"
          />
          <input
            type="date"
            value={form.date_added}
            onChange={(e) => setForm({ ...form, date_added: e.target.value })}
            className="px-4 py-2 rounded-full border border-gray-600 bg-green-50 text-gray-800 placeholder-gray-500"
          />
          <button
            onClick={addOrUpdateProperty}
            className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800"
          >
            {editingId ? "Update Property" : "+ Add Property"}
          </button>
        </div>
      </div>


      <div className="w-full md:w-[420px] lg:w-[480px] h-[520px] rounded-2xl overflow-hidden shadow-lg border border-gray-300">
        <Map />
      </div>
    </div>
  );
}
