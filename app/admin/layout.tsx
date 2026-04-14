// app/admin/layout.tsx

import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      {/* Sidebar Fixed di Kiri */}
      <Sidebar />

      {/* Konten Utama di Kanan */}
      <div className="flex-1 ml-64 min-h-screen bg-gray-50">
        {children}
      </div>
    </div>
  );
}