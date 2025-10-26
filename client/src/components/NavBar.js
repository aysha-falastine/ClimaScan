import React from "react";

const NavBar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white z-50 font-jost">
      <div className="max-w-7xl mx-auto px-8 py-3 flex items-center justify-between">
        {/* Logo as styled text */}
        <div className="flex flex-col items-start leading-tight">
          <h1 className="text-2xl font-bold font-jost">
            <span className="text-[#00AEEF]">Clima</span>
            <span className="text-[#29572C]">Scan</span>
          </h1>
          <p className="text-xs text-[#00AEEF] tracking-wide uppercase font-jost mt-1">
            PLANET. DATA. FUTURE.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-[50px] text-sm" >
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
    </nav>
  );
};

export default NavBar;
