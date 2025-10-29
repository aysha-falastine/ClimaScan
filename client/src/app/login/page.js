"use client";

import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useRouter } from "next/navigation";
const API_URL = "https://climascan.onrender.com";

const LoginPage = () => {
const router = useRouter();
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
e.preventDefault();
setError("");
setLoading(true);
try {
  const response = await fetch(`${API_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  // Safely handle non-JSON or error responses
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid server response (not JSON)");
  }

  if (response.ok) {
    localStorage.setItem("token", data.access_token);
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    router.push("/dashboard");
  } else {
    setError(data.error || "Login failed. Please try again.");
  }
} catch (err) {
  console.error("Login error:", err);
  setError("Server not reachable or invalid response.");
} finally {
  setLoading(false);
}
};

return (
<div
className="fixed inset-0 bg-cover bg-center brightness-100"
style={{ backgroundImage: "url('/landscape.jpg')" }}
>
{/* Logo */}
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
   {/* Nav */}
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
      <a
        href="/login"
        className="bg-black text-white px-4 py-1.5 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
      >
        Sign In
      </a>
    </div>
  </div>

  {/* Form */}
  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-white/10 backdrop-blur-md rounded-xl shadow-lg flex overflow-hidden text-black">
    <div className="w-1/2 p-8 flex flex-col justify-center gap-4">
      <h2 className="text-xl font-semibold font-poppins text-black">
        Hello! Sign in to your account
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-3 text-[#267D1A]" />
          <input
            type="email"
            placeholder="Email"
            className="pl-10 pr-4 py-2 rounded-md bg-black/80 text-white font-jost w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="relative">
          <FaLock className="absolute left-3 top-3 text-[#267D1A]" />
          <input
            type="password"
            placeholder="Password"
            className="pl-10 pr-4 py-2 rounded-md bg-black/80 text-white font-jost w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm font-jost">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`py-2 rounded-md font-jost transition-colors ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-white text-black hover:bg-[#267D1A]"
          }`}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="text-sm font-jost text-black mt-2">
        Don’t have an account?{" "}
        <a href="/signup" className="underline">
          Create
        </a>
      </p>
    </div>

    <div className="w-1/2 px-8 py-8 flex flex-col justify-center items-start text-left font-jost relative -top-4 -left-4">
      <h3
        className="text-3xl font-semibold text-black leading-snug"
        style={{ textShadow: "0px 1px 2px #29572C" }}
      >
        Welcome Back!
      </h3>
      <p className="text-base text-black mt-3 leading-relaxed max-w-[260px]">
        Together, let’s make smarter climate choices. Log in to continue.
      </p>
    </div>
  </div>
</div>
);
};

export default LoginPage;