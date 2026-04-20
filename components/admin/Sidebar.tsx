'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, LogOut } from 'lucide-react'; // Tambahkan icon LogOut

// Definisikan tipe untuk Props yang diterima Sidebar
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  adminData: { name: string; email: string };
  onLogout: () => void; // Tambahkan ini
}

export default function Sidebar({ isOpen, onClose, adminData, onLogout }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
      ),
    },
    {
      name: 'Products',
      path: '/admin/products',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
      ),
    },
    {
      name: 'User Profile',
      path: '/admin/profile',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className={`
      fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-50
      transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      lg:translate-x-0 
    `}>
      {/* Brand Logo & Tombol Close (Mobile) */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold">E</div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">Evomi</span>
        </div>

        {/* Tombol X hanya muncul di HP */}
        <button onClick={onClose} className="lg:hidden p-2 text-stone-400 hover:bg-stone-100 rounded-lg">
          <X size={20} />
        </button>
      </div>

      {/* Menu List */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <p className="px-4 text-[9px] uppercase tracking-[0.3em] text-stone-400 font-bold mb-4">Main Menu</p>
        {menuItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);

          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => { if (window.innerWidth < 1024) onClose(); }} // Tutup sidebar otomatis setelah klik di HP
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                ? 'bg-black text-white shadow-md'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer Sidebar (User Info untuk HP - karena topbar desktop disembunyikan di HP) */}
      <div className="p-4 border-t border-gray-100 lg:hidden">
        <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3 border border-gray-100/50">
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            <div className="w-full h-full bg-black flex items-center justify-center text-white font-bold text-xs">
              {adminData.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-gray-900 truncate">{adminData.name || "Admin"}</p>
            <p className="text-[10px] text-green-500 font-medium">Online</p>
          </div>

          {/* Tombol Logout Khusus Mobile */}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}