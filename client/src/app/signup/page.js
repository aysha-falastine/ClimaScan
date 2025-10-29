"use client";

import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useRouter } from "next/navigation"; //  Correct for Next.js routing
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const SignupPage = () => {
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const router = useRouter();

const handleSubmit = async (e) => {
e.preventDefault();
setError("");
  try {
  const response = await fetch(`${API_URL}/users/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  //  Safely parse backend response
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.error("❌ Server did not return JSON:", text);
    setError("Server error — backend did not return valid JSON.");
    return;
  }

  if (response.ok) {
    alert("Signup successful!");
    router.push("/login");
  } else {
    setError(data.error || "Signup failed. Please try again.");
  }
} catch (err) {
  console.error(err);
  setError("Server error. Please check your connection.");
}
};

return (
<div
className="fixed inset-0 bg-cover bg-center brightness-100"
style={{ backgroundImage: "url('/landscape.jpg')" }}
>
{/* Logo Top-Left */}
<div className="absolute top-6 left-10 z-10">
<div className="flex flex-col items-start leading-tight">
<h1 className="text-2xl font-bold font-jost">
<span className="text-[#00AEEF]">Clima</span>
<span className="text-[#29572C]">Scan</span>
</h1>
<p className="text-xs text-[#00AEEF] tracking-wide uppercase font-jost mt-1">
PLANET. DATA. FUTURE.
</p>
</div>
</div>

  {/* Top-Right Navigation */}
  <div className="absolute top-6 right-10 z-10">
    <div className="flex items-center space-x-[50px] text-sm">
      <a
        href="/about"
        className="text-[#29572C] font-medium hover:text-green-700 transition-colors"
      >
        ABOUT
      </a>
      <a
        href="/contact"
        className="text-[#29572C] font-medium hover:text-green-700 transition-colors"
      >
        CONTACT
      </a>
      <button
        onClick={() => router.push("/login")}
        className="bg-black text-white px-4 py-1.5 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
      >
        Sign In
      </button>
    </div>
  </div>

  {/* Centered Glass Container */}
  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-white/10 backdrop-blur-md rounded-xl shadow-lg flex overflow-hidden text-black">
    {/* Left: Signup Form */}
    <div className="w-1/2 p-8 flex flex-col justify-center gap-4">
      <h2 className="text-xl font-semibold font-poppins text-black">
        Welcome! Create your account
      </h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="pl-4 pr-4 py-2 rounded-md bg-black/80 text-white font-jost w-full"
            required
          />
        </div>
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-3 text-[#267D1A]" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="pl-10 pr-4 py-2 rounded-md bg-black/80 text-white font-jost w-full"
            required
          />
        </div>
        <div className="relative">
          <FaLock className="absolute left-3 top-3 text-[#267D1A]" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="pl-10 pr-4 py-2 rounded-md bg-black/80 text-white font-jost w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-[#ffffff] text-black py-2 rounded-md font-jost hover:bg-[#267D1A]"
        >
          Sign Up
        </button>
      </form>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>

    {/* Right: Promo Message */}
    <div className="w-1/2 px-10 py-8 flex flex-col justify-center items-start text-left font-jost relative -top-4 -left-4">
      <h3
        className="text-3xl font-semibold text-black leading-snug"
        style={{ textShadow: "0px 1px 2px #29572C" }}
      >
        Join Us!
      </h3>
      <h4
        className="text-2xl font-semibold text-[#000000] mt-2"
        style={{ textShadow: "0px 1px 2px #29572C" }}
      >
        ClimaScan
      </h4>
      <p className="text-base text-black mt-3 max-w-[280px] leading-relaxed">
        Together let’s make smarter climate decisions.
      </p>
    </div>
  </div>
</div>
);
};

export default SignupPage;