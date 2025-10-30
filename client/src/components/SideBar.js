"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiHome, FiMapPin, FiFileText, FiUser, FiMessageCircle } from "react-icons/fi";

export default function SidebarLayout({ children }) {
  const router = useRouter();

  const handleLogout = () => {

    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50 font-[Jost] font-medium">
      {/* Sidebar */}
      <aside className="w-[200px] bg-white shadow-md flex flex-col">
        <nav className="p-6 space-y-4 flex-1">
          <Link href="/landing" className="flex flex-col items-start leading-tight cursor-pointer hover:opacity-80 transition-opacity">
            <h1 className="text-2xl font-bold font-jost">
              <span className="text-[#00AEEF]">Clima</span>
              <span className="text-[#29572C]">Scan</span>
            </h1>
            <p className="text-xs text-[#00AEEF] tracking-wide uppercase font-jost mt-1">
              PLANET. DATA. FUTURE.
            </p>
          </Link>

          <ul className="space-y-10 mt-[30px]">
            <li>
              <Link href="/dashboard" className="flex items-center gap-3 text-gray-700 hover:text-blue-500">
                <FiHome className="text-lg" /> Dashboard
              </Link>
            </li>
            <li>
              <Link href="/properties" className="flex items-center gap-3 text-gray-700 hover:text-blue-500">
                <FiMapPin className="text-lg" /> Properties
              </Link>
            </li>
            <li>
              <Link href="/reports" className="flex items-center gap-3 text-gray-700 hover:text-blue-500">
                <FiFileText className="text-lg" /> Reports
              </Link>
            </li>
            <li>
              <Link href="/ai-chat" className="flex items-center gap-3 text-gray-700 hover:text-blue-500">
                <FiMessageCircle className="text-lg" /> AI Chat
              </Link>
            </li>
          </ul>
        </nav>

        {/* Logout pinned to bottom */}
        <div className="p-6 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full bg-black text-white text-sm py-1.5 rounded hover:bg-gray-800"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
