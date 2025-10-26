import React from "react";
import { FaLinkedin, FaEnvelope } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-white text-[#29572C] py-6 font-jost">
      <div className="max-w-7xl mx-auto px-8 flex flex-col items-center space-y-4">
        {/* Social Icons */}
        <div className="flex space-x-6">
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="text-blue-600 text-xl hover:opacity-80" />
          </a>
          <a href="mailto:info@climascan.com">
            <FaEnvelope className="text-[#000000] text-xl hover:opacity-80" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaXTwitter className="text-[#000000] text-xl hover:opacity-80" />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-sm">© 2025 ClimaScan. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
