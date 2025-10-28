import Link from 'next/link';
import { FiHome, FiMapPin, FiFileText, FiUser } from 'react-icons/fi';

export default function Layout({ children }) {
  return (
    <div className="flex h-[1171px] bg-white-100 font-[Jost] font-medium">
      {/* Sidebar */}
      <aside className="w-[200px] bg-white shadow-md flex flex-col">
        <nav className="p-6 space-y-4">
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
                <FiHome className="text-lg" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/properties" className="flex items-center gap-3 text-gray-700 hover:text-blue-500">
                <FiMapPin className="text-lg" />
                Properties
              </Link>
            </li>
            <li>
              <Link href="/reports" className="flex items-center gap-3 text-gray-700 hover:text-blue-500">
                <FiFileText className="text-lg" />
                Reports
              </Link>
            </li>
          </ul>
        </nav>

        {/* Logout pinned to bottom */}
        <div className="p-6 mt-auto">
          <button className="w-full bg-black text-white text-sm py-1.5 rounded hover:bg-gray-800">
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Navigation (no shadow) */}
        <header className="flex justify-end items-center bg-white px-10 py-4 space-x-10">
          <Link href="/about" className="text-[#377541] hover:underline">About</Link>
          <Link href="/contact" className="text-[#377541] hover:underline">Contact</Link>
          <Link href="/profile" className="text-gray-600 hover:text-blue-500">
            <FiUser className="text-xl" />
          </Link>
        </header>

        {/* Page Content */}
        <section className="p-10 overflow-y-auto">
          {children}
        </section>
      </main>
    </div>
  );
}
