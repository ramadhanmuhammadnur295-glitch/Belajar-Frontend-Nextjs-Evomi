"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";

// Font Initialization
const fontJudul = localFont({
    src: "../../fonts/8 Heavy.ttf",
    variable: "--font-brand",
});

const fontCaption = localFont({
    src: "../../fonts/Nohemi-Regular.otf",
    variable: "--font-body",
});

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // TAMBAHKAN STATE INI: Untuk efek loading pada tombol Pay Now
    const [isPaying, setIsPaying] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            router.push("/login");
            return;
        }

        const fetchOrderDetail = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/orders/${params.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });
                const result = await response.json();

                if (result.status === "success") {
                    setOrder(result.data);
                }
            } catch (error) {
                console.error("Error fetching order detail:", error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) fetchOrderDetail();
    }, [params.id, router]);

    // TAMBAHKAN FUNGSI INI: Untuk melakukan update status ke backend
    const handlePayment = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        setIsPaying(true);
        try {
            const response = await fetch(`http://localhost:8000/api/orders/${params.id}`, {
                method: "PUT", // Method PUT sesuai standar update data
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    status_pembayaran: "success", // Data yang diupdate
                }),
            });

            const result = await response.json();

            if (result.success) {
                // Update local state agar UI langsung berubah tanpa perlu refresh halaman
                setOrder((prevOrder: any) => ({
                    ...prevOrder,
                    status_pembayaran: "success",
                }));
                alert("Pembayaran berhasil!");
            } else {
                alert("Gagal memproses pembayaran: " + (result.message || "Unknown error"));
            }
        } catch (error) {
            console.error("Payment error:", error);
            alert("Terjadi kesalahan pada server.");
        } finally {
            setIsPaying(false);
        }
    };


    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FBFBF9]">
            <div className="w-8 h-8 border-4 border-stone-200 border-t-[#0081D1] rounded-full animate-spin"></div>
        </div>
    );

    if (!order) return null;

    return (
        <div className={`${fontCaption.variable} ${fontJudul.variable} min-h-screen bg-[#FBFBF9] font-sans antialiased pb-10 md:pb-20`}>

            {/* NAVBAR */}
            {/* NAVBAR */}
            <nav className="fixed w-full z-[100] bg-[#0081D1] backdrop-blur-md border-b border-blue-800/20">
                <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center">
                    <div className="flex items-center space-x-4 md:space-x-6">
                        <Link href="/orders" className="flex items-center space-x-2 text-white/70 hover:text-white transition-all group">
                            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/40 transition-all">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path d="M15 19l-7-7 7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="hidden md:inline text-[10px] font-bold uppercase tracking-[0.2em]">Kembali</span>
                        </Link>
                        <div className="w-[1px] h-4 bg-white/20"></div>
                        <Link href="/">
                            <Image
                                src="/img/Logo Evomi.png"
                                alt="Evomi"
                                width={65}
                                height={25}
                                // Tambahkan brightness-0 invert agar logo menjadi putih
                                className="brightness-0 invert"
                            />
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="pt-24 md:pt-32 px-4 md:px-8 max-w-6xl mx-auto">

                {/* INFO HEADER */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-12">
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <span className="w-2 h-2 rounded-full bg-[#0081D1] animate-pulse"></span>
                            <p className="text-[10px] text-[#0081D1] font-bold uppercase tracking-[0.3em]">Order Detail</p>
                        </div>
                        <h1 className={`${fontJudul.className} text-3xl md:text-5xl text-stone-900 uppercase tracking-tighter`}>
                            #{order.id} <span className="text-stone-300 italic font-light">Details</span>
                        </h1>
                    </div>

                    <div className={`self-start md:self-auto px-5 py-2 rounded-full border text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm
            ${order.status_pembayaran === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                        Payment {order.status_pembayaran}
                    </div>
                </div>

                {/* BENTO GRID SYSTEM */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

                    {/* LEFT CONTENT: ITEMS (8 Columns on Desktop) */}
                    <div className="lg:col-span-8 space-y-6">
                        <section className="bg-white rounded-[2rem] md:rounded-[3rem] border border-stone-100 overflow-hidden shadow-sm">
                            <div className="p-6 md:p-8 border-b border-stone-50 bg-stone-50/30 flex justify-between items-center">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 font-sans">Daftar Produk</h3>
                                <span className="text-[10px] text-stone-400">{order.details?.length} Items</span>
                            </div>

                            <div className="divide-y divide-stone-50">
                                {order.details?.map((item: any) => (
                                    <div key={item.id} className="p-6 md:p-8 flex items-center space-x-4 md:space-x-8 group">
                                        <div className="w-20 h-24 md:w-28 md:h-32 bg-stone-50 rounded-2xl md:rounded-3xl overflow-hidden relative shrink-0 border border-stone-100">
                                            <Image
                                                src={item.product?.image_url || "/img/placeholder.png"}
                                                alt={item.product?.nama}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[9px] text-[#0081D1] font-bold uppercase tracking-widest mb-1">{item.product?.id}</p>
                                            <h4 className={`${fontJudul.className} text-lg md:text-xl text-stone-800 uppercase truncate`}>{item.product?.nama}</h4>
                                            <p className="text-xs text-stone-400 font-light mt-1">
                                                {item.jumlah} Pcs • Rp {Number(item.harga_saat_beli).toLocaleString("id-ID")}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-stone-900 text-sm md:text-base">
                                                Rp {(item.jumlah * Number(item.harga_saat_beli)).toLocaleString("id-ID")}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* SHIPPING INFO (BENTO CARD 2) */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-sm">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-4">Pengiriman</h3>
                                <p className="text-sm text-stone-800 font-medium leading-relaxed">{order.alamat_pengiriman}</p>
                                <div className="mt-4 flex items-center space-x-2">
                                    <span className="text-[10px] bg-stone-100 px-2 py-1 rounded text-stone-500 uppercase font-bold tracking-tighter">{order.kurir}</span>
                                </div>
                            </div>
                            <div className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-sm flex flex-col justify-between">
                                <div>
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Catatan</h3>
                                    <p className="text-xs text-stone-500 italic">"{order.catatan_pengiriman || "Tidak ada instruksi khusus"}"</p>
                                </div>
                                <p className="text-[10px] text-stone-300 mt-4">Order ID: {order.id}</p>
                            </div>
                        </section>
                    </div>

                    {/* RIGHT CONTENT: SUMMARY (4 Columns on Desktop) */}
                    <div className="lg:col-span-4">
                        <div className="bg-stone-900 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 text-white sticky top-28 shadow-2xl shadow-stone-200">
                            <h3 className={`${fontJudul.className} text-2xl uppercase mb-8`}>Summary</h3>

                            <div className="space-y-5 mb-10">
                                <div className="flex justify-between text-white/50 text-xs uppercase tracking-widest font-bold">
                                    <span>Subtotal</span>
                                    <span className="text-white">Rp {Number(order.total_harga).toLocaleString("id-ID")}</span>
                                </div>
                                <div className="flex justify-between text-white/50 text-xs uppercase tracking-widest font-bold">
                                    <span>Shipping</span>
                                    <span className="text-white">Rp {Number(order.ongkos_kirim).toLocaleString("id-ID")}</span>
                                </div>
                                <div className="h-[1px] bg-white/10 my-2"></div>
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">Grand Total</span>
                                    <span className={`${fontJudul.className} text-3xl text-[#0081D1]`}>
                                        Rp {(Number(order.total_harga) + Number(order.ongkos_kirim)).toLocaleString("id-ID")}
                                    </span>
                                </div>
                            </div>

                            {/* Di bagian RIGHT CONTENT: SUMMARY, ubah tombol Pay Now menjadi seperti ini: */}

                            {order.status_pembayaran === 'pending' ? (
                                <button
                                    onClick={handlePayment} // Panggil fungsi di sini
                                    disabled={isPaying}     // Disable saat loading
                                    className={`w-full py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500 shadow-lg 
                                        ${isPaying
                                            ? 'bg-stone-500 text-stone-300 cursor-not-allowed'
                                            : 'bg-[#0081D1] hover:bg-white hover:text-[#0081D1] shadow-[#0081D1]/20 text-white'
                                        }`}
                                >
                                    {isPaying ? 'Processing...' : 'Pay Now'}
                                </button>
                            ) : (
                                <div className="w-full border border-white/10 py-5 rounded-2xl text-[10px] text-center font-bold uppercase tracking-[0.3em] text-white/40">
                                    Order Completed
                                </div>
                            )}

                            <p className="mt-8 text-[9px] text-white/30 text-center leading-relaxed font-light">
                                Thank you for choosing Evomi.<br />Artisan fragrances delivered to your door.
                            </p>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}