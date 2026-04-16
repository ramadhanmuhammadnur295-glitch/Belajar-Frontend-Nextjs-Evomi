"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { useRouter } from "next/navigation";

// Font Initialization (Pastikan path sesuai dengan project kamu)
const fontJudul = localFont({
    src: "../fonts/8 Heavy.ttf",
    variable: "--font-brand",
});

const fontCaption = localFont({
    src: "../fonts/Nohemi-Regular.otf",
    variable: "--font-body",
});

export default function OrderHistoryPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        const savedUser = localStorage.getItem("user_data");

        if (!token || !savedUser) {
            router.push("/login");
            return;
        }

        setUser(JSON.parse(savedUser));

        // Fetch Order History dari API Laravel
        const fetchOrders = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/orders", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });
                const result = await response.json();
                setOrders(result.data || result);
            } catch (error) {
                console.error("Gagal mengambil riwayat pesanan:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_data");
        router.push("/");
    };

    // Helper untuk warna status
    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case "success": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "pending": return "bg-amber-50 text-amber-600 border-amber-100";
            case "failed": return "bg-red-50 text-red-600 border-red-100";
            case "expired": return "bg-rose-50 text-rose-600 border-rose-100";
            default: return "bg-stone-50 text-stone-600 border-stone-100";
        }
    };

    return (
        <div className={`${fontCaption.variable} ${fontJudul.variable} min-h-screen bg-[#FBFBF9] font-sans antialiased`}>

            {/* NAVBAR (Minimalis Version) */}
            <nav className="fixed w-full z-[100] bg-white/80 backdrop-blur-md border-b border-stone-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="hover:opacity-70 transition-opacity">
                        <Image src="/img/Logo Evomi.png" alt="Evomi" width={80} height={32} className="brightness-0" />
                    </Link>

                    <div className="relative">
                        {user && (
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center space-x-3 border border-stone-200 rounded-full p-1 pr-4 hover:bg-stone-50 transition-all"
                            >
                                <div className="w-8 h-8 rounded-full bg-[#0081D1] text-white flex items-center justify-center text-xs font-bold uppercase">
                                    {user.name.charAt(0)}
                                </div>
                                <span className="text-sm font-medium text-stone-700">{user.username}</span>
                            </button>
                        )}

                        {isMenuOpen && (
                            <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-stone-100 py-2 z-50">
                                <Link href="/profile" className="block px-4 py-3 text-sm text-stone-600 hover:bg-stone-50">Profile</Link>
                                <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50">Logout</button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
                {/* HEADER */}
                <div className="mb-12">
                    <h1 className={`${fontJudul.className} text-4xl md:text-5xl text-stone-900 uppercase tracking-tighter`}>
                        Order <span className="italic font-light text-stone-400 text-3xl md:text-4xl">History</span>
                    </h1>
                    <p className="text-stone-500 mt-2 font-light">Pantau status pesanan parfum artisan Anda.</p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="w-10 h-10 border-4 border-stone-200 border-t-[#0081D1] rounded-full animate-spin"></div>
                        <p className="text-stone-400 text-sm tracking-widest uppercase">Memuat Data...</p>
                    </div>
                ) : orders.length > 0 ? (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white border border-stone-100 rounded-3xl overflow-hidden hover:shadow-lg hover:shadow-stone-200/50 transition-all duration-500 group">
                                <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">

                                    {/* Info Utama */}
                                    <div className="flex items-start space-x-6">
                                        <div className="w-20 h-24 bg-stone-50 rounded-xl flex-shrink-0 relative overflow-hidden">
                                            {/* Placeholder icon jika tidak ada gambar produk utama */}
                                            <div className="absolute inset-0 flex items-center justify-center text-stone-300">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em] font-bold">Order #{order.order_number || order.id}</p>
                                            <h3 className={`${fontJudul.className} text-xl text-stone-800 uppercase`}>
                                                {order.items?.[0]?.product_name || "Fragrance Collection"}
                                                {order.items?.length > 1 && <span className="text-sm normal-case font-sans text-stone-400 ml-2">+{order.items.length - 1} items</span>}
                                            </h3>
                                            <p className="text-sm text-stone-500 font-light">Dipesan pada {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                        </div>
                                    </div>

                                    {/* Status & Harga */}
                                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                                        <div className="text-right">
                                            <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">Total Transaksi</p>
                                            <p className="text-lg font-bold text-stone-900">Rp {Number(order.total_harga).toLocaleString("id-ID")}</p>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusStyle(order.status_pembayaran)}`}>
                                            {order.status_pembayaran}
                                        </span>
                                    </div>
                                </div>

                                {/* Footer Card */}
                                <div className="px-8 py-4 bg-stone-50/50 flex justify-end items-center border-t border-stone-50">
                                    <Link
                                        href={`/orders/${order.id}`}
                                        className="text-[10px] font-bold uppercase tracking-widest text-[#0081D1] hover:text-[#006bb0] transition-colors flex items-center space-x-2"
                                    >
                                        <span>Lihat Detail Pesanan</span>
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* EMPTY STATE */
                    <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-stone-200">
                        <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h3 className={`${fontJudul.className} text-xl text-stone-800 uppercase`}>Belum Ada Pesanan</h3>
                        <p className="text-stone-500 font-light mt-2 mb-8">Sepertinya Anda belum memulai perjalanan aroma bersama kami.</p>
                        <Link href="/produk" className="bg-stone-900 text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#0081D1] transition-all shadow-lg shadow-stone-200">
                            Mulai Belanja
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}