"use client";

import React, { useState } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
  };

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />


      <h1 className="text-4xl font-bold text-[#150B0B] text-center mt-24 mb-10">
        Contact Us
      </h1>


      <div className="flex-1 flex flex-col items-center justify-center p-6 mb-32">
        <div className="bg-gradient-to-br from-green-50 to-cyan-50 rounded-3xl p-20 w-full max-w-2xl shadow-lg border border-gray-200">
          <div className="space-y-8">

            <div className="flex items-center gap-4">
              <label className="text-green-600 font-medium w-24 text-right">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Your Name"
                className="flex-1 px-6 py-3 rounded-full bg-white border-b-4 border-gray-300 focus:border-green-500 focus:outline-none transition-colors placeholder-gray-500 text-gray-800 text-center shadow-[0_4px_6px_-1px_rgba(0,0,0,0.08)]"
              />
            </div>


            <div className="flex items-center gap-4">
              <label className="text-green-600 font-medium w-24 text-right">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Your Email"
                className="flex-1 px-6 py-3 rounded-full bg-white border-b-4 border-gray-300 focus:border-green-500 focus:outline-none transition-colors placeholder-gray-500 text-gray-800 text-center shadow-[0_4px_6px_-1px_rgba(0,0,0,0.08)]"
              />
            </div>


            <div className="flex items-start gap-4">
              <label className="text-green-600 font-medium w-24 text-right pt-3">
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => handleChange("message", e.target.value)}
                placeholder="Write your Message"
                rows="4"
                className="flex-1 px-6 py-3 rounded-3xl bg-white border-b-4 border-gray-300 focus:border-green-500 focus:outline-none transition-colors placeholder-gray-500 text-gray-800 text-center shadow-[0_4px_6px_-1px_rgba(0,0,0,0.08)] resize-none"
              />
            </div>


            <div className="flex justify-center pt-6">
              <button
                onClick={handleSubmit}
                className="px-12 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors font-medium"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>


      <div className="w-full mt-auto">
        <Footer />
      </div>
    </div>
  );
}
