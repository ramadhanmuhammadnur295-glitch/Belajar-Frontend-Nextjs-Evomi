// components/admin/AdminLayout.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("admin_token");
        if (!token) router.push("/admin/login");
    }, [router]);

    return (
        <div className="flex min-h-screen bg-[#F8F8F8]">
            {/* Sidebar Modern */}
            <aside className="w-72 bg-white border-r border-stone-100 p-10 fixed h-full z-10">
                <div className="mb-16">
                    <h2 className="text-xl font-light tracking-[0.5em] uppercase">Evomi</h2>
                    <div className="h-[1px] w-10 bg-black mt-4"></div>
                </div>
                
                <nav className="space-y-8">
                    <div className="space-y-4">
                        <p className="text-[9px] uppercase tracking-[0.3em] text-stone-300 font-bold">Main Menu</p>
                        <ul className="space-y-2">
                            <li className="text-[11px] uppercase tracking-widest text-black font-medium cursor-pointer hover:translate-x-1 transition-transform">Dashboard</li>
                            <li className="text-[11px] uppercase tracking-widest text-stone-400 hover:text-black cursor-pointer transition-all">Products</li>
                            <li className="text-[11px] uppercase tracking-widest text-stone-400 hover:text-black cursor-pointer transition-all">Orders</li>
                        </ul>
                    </div>
                </nav>
            </aside>

            {/* Content Area */}
            <main className="flex-1 ml-72 p-16">
                {children}
            </main>
        </div>
    );
}