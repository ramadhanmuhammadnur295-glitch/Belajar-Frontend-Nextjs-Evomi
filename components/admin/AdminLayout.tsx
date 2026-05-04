"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Menu, X, User, Bell } from "lucide-react";
import Link from "next/link";

// TODO: Add discount logic here
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [adminData, setAdminData] = useState({ name: "Admin", email: "" });

    // 1. Proteksi Halaman & Fetch Data Admin
    useEffect(() => {
        const token = localStorage.getItem("admin_token");
        if (!token) {
            router.push("/admin/login");
            return;
        }

        // Ambil data admin untuk ditampilkan di Navbar
        const fetchAdminMe = async () => {
            try {
                const res = await fetch("https://ramadhan.alwaysdata.net/api/admin/me", {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });
                const result = await res.json();
                if (result.success) {
                    setAdminData({ name: result.data.name, email: result.data.email });
                }
            } catch (err) {
                console.error("Gagal mengambil data admin:", err);
            }
        };

        fetchAdminMe();
    }, [router]);

    // 2. Fungsi Logout (Sesuai Referensi)
    const handleLogout = async () => {
        const token = localStorage.getItem('admin_token');
        try {
            await fetch('https://ramadhan.alwaysdata.net/api/admin/logout', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error("Gagal koneksi ke server untuk logout:", error);
        } finally {
            localStorage.removeItem('admin_token');
            router.push('/admin/login'); // Sesuaikan path login Anda
        }
    };

    return (
        <div className="flex min-h-screen bg-[#F8F8F8]">
            {/* --- SIDEBAR (Mobile: Hidden by default, Desktop: Fixed) --- */}
            <aside className={`
                w-72 bg-white border-r border-stone-100 p-10 fixed h-full z-50 transition-transform duration-300
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
                lg:translate-x-0
            `}>
                <div className="mb-16 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-light tracking-[0.5em] uppercase text-black">Evomi</h2>
                        <div className="h-[1px] w-10 bg-black mt-4"></div>
                    </div>
                    <button className="lg:hidden p-2 text-stone-400" onClick={() => setIsMobileMenuOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                <nav className="space-y-8">
                    <div className="space-y-4">
                        <p className="text-[9px] uppercase tracking-[0.3em] text-stone-300 font-bold">Main Menu</p>
                        <ul className="space-y-2">
                            <Link href="/admin/dashboard" className="block text-[11px] uppercase tracking-widest text-black font-medium hover:translate-x-1 transition-transform">Dashboard</Link>
                            <Link href="/admin/products" className="block text-[11px] uppercase tracking-widest text-stone-400 hover:text-black transition-all">Products</Link>
                            <Link href="/admin/orders" className="block text-[11px] uppercase tracking-widest text-stone-400 hover:text-black transition-all">Orders</Link>
                        </ul>
                    </div>
                </nav>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 lg:ml-72 flex flex-col">

                {/* --- STICKY NAVBAR (Sesuai gaya Landing Dashboard) --- */}
                <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-100">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
                        {/* Mobile Toggle */}
                        <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-stone-600">
                            <Menu size={20} />
                        </button>

                        <div className="hidden lg:block">
                            <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">Administrator Panel</p>
                        </div>

                        {/* User Actions & Logout */}
                        <div className="flex items-center gap-6">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-stone-800 leading-none">{adminData.name}</p>
                                <p className="text-[10px] text-green-500 mt-1 uppercase tracking-tighter">● Online</p>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-white hover:bg-red-50 text-stone-600 hover:text-red-600 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm border border-stone-100 hover:border-red-100 shadow-sm"
                            >
                                <LogOut size={16} />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Page Content */}
                <main className="p-8 lg:p-12">
                    {children}
                </main>
            </div>

            {/* Overlay Mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    );
}