
"use client";

import { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import dynamic from "next/dynamic";



const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function PropertiesPage() {
  const [properties, setProperties] = useState([
    { id: 1, name: "Kilimani Heights Apartments", location: "Nairobi, Kilimani", date: "09/20/2025" },
    { id: 2, name: "Nyali Beach Villas", location: "Mombasa, Nyali", date: "09/20/2025" },
    { id: 3, name: "Greenview Estate", location: "Nakuru, Milimani", date: "09/20/2025" },
    { id: 4, name: "Ridgeview Homes", location: "Eldoret, Elgon View", date: "09/20/2025" },
    { id: 5, name: "Lakeview Residency", location: "Kisumu, Milimani", date: "09/20/2025" },
  ]);

  return (
    <div className="flex flex-col md:flex-row gap-10">

      <div className="flex-1">
        <h1 className="text-3xl font-bold text-[#29572C] mb-8">Properties</h1>


        <div className="w-full max-w-lg mb-6">
          <input
            type="text"
            placeholder="Search property"
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
                <th className="py-3 px-6 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p, index) => (
                <tr
                  key={p.id}
                  className={`${index % 2 === 0 ? "bg-green-50" : "bg-green-100"
                    } hover:bg-green-200 transition-colors`}
                >
                  <td className="py-3 px-6 text-sm text-gray-800">{p.name}</td>
                  <td className="py-3 px-6 text-sm text-gray-800">{p.location}</td>
                  <td className="py-3 px-6 text-sm text-gray-800">{p.date}</td>
                  <td className="py-3 px-6 flex gap-4 text-gray-700">
                    <FiEdit2 className="cursor-pointer hover:text-green-700" />
                    <FiTrash2 className="cursor-pointer hover:text-red-600" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        <div className="flex justify-center items-center space-x-2 mt-6 text-sm text-gray-500">
          <span>&lt;</span>
          <span className="font-semibold text-black">1</span>
          <span>2</span>
          <span>3</span>
          <span>&gt;</span>
        </div>


        <div className="flex flex-col items-center mt-8 space-y-4">
          <div className="flex flex-wrap justify-center gap-6">
            <input
              type="text"
              placeholder="Property name"
              className="border border-gray-400 rounded-full px-5 py-2 bg-green-50 placeholder-gray-500 focus:outline-none focus:border-green-500"
            />
            <input
              type="text"
              placeholder="Location"
              className="border border-gray-400 rounded-full px-5 py-2 bg-green-50 placeholder-gray-500 focus:outline-none focus:border-green-500"
            />
            <input
              type="date"
              className="border border-gray-400 rounded-full px-5 py-2 bg-green-50 text-gray-600 focus:outline-none focus:border-green-500"
            />
          </div>

          <button className="mt-3 bg-black text-white px-8 py-2 rounded-full hover:bg-gray-800 transition">
            + Add New Property
          </button>
        </div>
      </div>


      <div className="w-full md:w-[420px] lg:w-[480px] h-[520px] rounded-2xl overflow-hidden shadow-lg border border-gray-300">
        <Map />
      </div>
    </div>
  );
}

