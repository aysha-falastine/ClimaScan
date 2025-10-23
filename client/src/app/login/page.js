import React from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const LoginPage = () => {
  return (
    <div
      className="fixed inset-0 bg-cover bg-center brightness-100"
      style={{ backgroundImage: "url('/landscape.jpg')" }} // Replace with actual path
    >
      {/* ✅ Logo Top-Left */}
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

      {/* ✅ Top-Right Navigation */}
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
          <button className="bg-black text-white px-4 py-1.5 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
            Sign In
          </button>
        </div>
      </div>

      {/* ✅ Centered Glass Container */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-white/10 backdrop-blur-md rounded-xl shadow-lg flex overflow-hidden text-black">
        {/* Left: Sign-in Form */}
        <div className="w-1/2 p-8 flex flex-col justify-center gap-4">
          <h2 className="text-xl font-semibold font-poppins text-black">
            Hello! Sign in to your account
          </h2>
          <form className="flex flex-col gap-4">
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-[#267D1A]" />
              <input
                type="email"
                placeholder="Email"
                className="pl-10 pr-4 py-2 rounded-md bg-black/80 text-white font-jost w-full"
              />
            </div>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-[#267D1A]" />
              <input
                type="password"
                placeholder="Password"
                className="pl-10 pr-4 py-2 rounded-md bg-black/80 text-white font-jost w-full"
              />
            </div>
            <div className="flex justify-between items-center text-sm font-jost text-black">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#" className="underline">Forgot password?</a>
            </div>
            <button
              type="submit"
              className="bg-[#ffffff] text-black py-2 rounded-md font-jost hover:bg-[#267D1A]"
            >
              Sign in
            </button>
          </form>
          <p className="text-sm font-jost text-black mt-2">
            Don’t have an account? <a href="#" className="underline">Create</a>
          </p>
        </div>

        {/* Right: Welcome Message */}
<div className="w-1/2 px-8 py-8 flex flex-col justify-center items-start text-left font-jost relative -top-4 -left-4">
  <h3
    className="text-3xl font-semibold text-black leading-snug"
    style={{ textShadow: '0px 1px 2px #29572C' }}
  >
    Welcome Back!
  </h3>
  <p className="text-base text-black mt-3 leading-relaxed max-w-[260px]">
    Together, let’s make smarter climate choices.<br />
    Log in to continue.
  </p>
</div>

      </div>
    </div>
  );
};

export default LoginPage;
