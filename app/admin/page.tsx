// app/admin/page.tsx

import AdminLayout from "@/components/admin/AdminLayout";

// AdminDashboard adalah halaman utama dashboard admin
export default function AdminDashboard() {
  const stats = [
    { label: "Total Revenue", value: "Rp 12.450.000", change: "+12%" },
    { label: "Active Orders", value: "24", change: "5 Pending" },
    { label: "Total Products", value: "48", change: "In 4 Brands" },
    { label: "New Customers", value: "112", change: "+8 today" },
  ];

  return (
    // 1. Menggunakan komponen AdminLayout sebagai wrapper
    <AdminLayout>
      <header className="mb-12">
        <h2 className="text-3xl font-light tracking-tighter uppercase">Overview</h2>
        <p className="text-stone-400 text-xs mt-2">Welcome back. Here is what's happening today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 border border-stone-100 shadow-sm rounded-sm">
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-4">{stat.label}</p>
            <h3 className="text-2xl font-light mb-1">{stat.value}</h3>
            <p className="text-[9px] text-stone-500 font-medium tracking-wide uppercase">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders Table Placeholder */}
      <section className="bg-white border border-stone-100 rounded-sm overflow-hidden">
        <div className="p-6 border-b border-stone-50 flex justify-between items-center">
            <h3 className="text-xs uppercase tracking-widest font-bold">Recent Orders</h3>
            <button className="text-[10px] text-stone-400 uppercase tracking-widest hover:text-black">View All</button>
        </div>
        <div className="p-6 text-center text-stone-300 text-xs italic">
           Table order details akan muncul di sini...
        </div>
      </section>
    </AdminLayout>
  );
}