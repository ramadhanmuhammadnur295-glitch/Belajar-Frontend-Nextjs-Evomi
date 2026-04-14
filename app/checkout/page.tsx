"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Interface disesuaikan dengan Shopping Bag kamu
interface CartItem {
    product_id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

interface UserProfile {
    name: string;
    email: string;
    phone?: string;
    address?: string;
}

export default function CheckoutPage() {

    // Di dalam export default function CheckoutPage() { ...
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [shippingAddress, setShippingAddress] = useState("");
    const [catatan, setCatatan] = useState("");

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [orderId, setOrderId] = useState(null); // Untuk menampilkan nomor pesanan pelanggan

    const fetchData = async () => {
        const token = localStorage.getItem("access_token");

        if (!token) {
            setError("Silakan login terlebih dahulu.");
            setLoading(false);
            return;
        }

        try {
            // 1. Fetch Cart Data (Sama seperti Shopping Bag)
            const cartRes = await fetch(`http://127.0.0.1:8000/api/cart`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            // 2. Fetch User Profile (Asumsi endpoint profil kamu)
            const userRes = await fetch(`http://127.0.0.1:8000/api/user`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (cartRes.ok && userRes.ok) {
                const cartData = await cartRes.json();
                const userData = await userRes.json();

                setCartItems(cartData.cart || []);
                setUser(userData.user || userData);
                // Sesuaikan dengan struktur response Laravelmu
            } else {
                setError("Gagal memuat data checkout.");
            }
        } catch (err) {
            console.error("Checkout Fetch Error:", err);
            setError("Terjadi kesalahan koneksi.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    // ubah / update product database di Laravel, pastikan endpointnya benar dan sesuai dengan struktur data yang dikirim dari frontend
    const handleCheckout = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) return alert("Silakan login terlebih dahulu");

        if (!shippingAddress) {
            alert("Mohon isi alamat pengiriman");
            return;
        }

        setIsSubmitting(true);

        const orderData = {
            total_harga: subtotal,
            ongkos_kirim: shipping,
            alamat_pengiriman: shippingAddress,
            catatan_pengiriman: catatan,
            kurir: "Reguler (COD)",
            // Backend mengambil items dari table Cart berdasarkan user_id, 
            // tapi mengirim ini tetap bagus untuk verifikasi data frontend-backend.
            items: cartItems.map(item => ({
                product_id: item.product_id,
                jumlah: item.quantity
            }))
        };

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/orders/checkout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(orderData),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // alert("Pesanan berhasil dibuat!");
                // setOrderId(result.order_id); // Simpan ID pesanan dari Laravel
                setShowSuccessModal(true);  // Tampilkan modal

            } else {
                // Menampilkan pesan error spesifik dari Laravel (misal: "Stok tidak mencukupi")
                alert(result.message || "Gagal membuat pesanan");
            }
        } catch (err) {
            console.error("Checkout Error:", err);
            alert("Terjadi kesalahan koneksi, silakan coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = 12000;
    const total = subtotal + shipping;

    if (loading) return <div className="p-20 text-center text-stone-500 animate-pulse tracking-widest uppercase text-xs">Menyiapkan Pesanan...</div>;
    if (error) return <div className="p-20 text-center text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-white py-12 px-6 lg:px-16 font-sans">
            <div className="max-w-6xl mx-auto">

                {/* --- MODAL SUCCESS CHECKOUT --- */}
                {showSuccessModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Backdrop dengan Blur Tinggi */}
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-md transition-opacity"></div>

                        {/* Card Modal */}
                        <div className="relative bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 w-full max-w-md p-10 overflow-hidden text-center transform transition-all animate-in fade-in zoom-in duration-500">

                            {/* Icon Success Beranimasi */}
                            <div className="relative mx-auto w-24 h-24 mb-6">
                                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
                                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-12 h-12">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                </div>
                            </div>

                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
                            <p className="text-gray-500 mb-6">
                                Terima kasih telah memilih <span className="font-bold text-indigo-600">Evomi</span>.
                                Pesanan kamu <span className="font-mono font-bold text-gray-800">#{orderId}</span> sedang kami siapkan.
                            </p>

                            <div className="space-y-3">
                                {/* <button
                                    onClick={() => window.location.href = '/dashboard/orders'}
                                    className="w-full py-4 rounded-2xl bg-gray-900 text-white font-bold hover:bg-black transition-all active:scale-95 shadow-xl"
                                >
                                    Lihat Pesanan Saya
                                </button> */}

                                <button
                                    onClick={() => window.location.href = '/profile'}

                                    className="w-full py-4 rounded-2xl bg-white text-gray-600 font-semibold hover:bg-gray-50 transition-all border border-gray-100"
                                >
                                    Lanjut Belanja
                                </button>
                            </div>

                            {/* Dekorasi Tambahan */}
                            <p className="mt-8 text-xs text-gray-400">
                                Konfirmasi pembayaran telah dikirim ke email kamu.
                            </p>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="flex justify-between items-end border-b border-stone-200 pb-6 mb-10">
                    <div>
                        <Link href="/profile" className="text-[10px] uppercase tracking-[0.2em] text-stone-400 hover:text-black transition-all mb-2 block">
                            &larr; Back to Bag
                        </Link>
                        <h1 className="text-4xl uppercase tracking-tighter font-light">Checkout</h1>
                    </div>
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">
                        {cartItems.length} {cartItems.length > 1 ? 'Items' : 'Item'}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* Form Informasi Pengiriman (Data dari User Login) */}
                    <div className="lg:col-span-7 space-y-12">
                        <section>
                            <h2 className="text-xs uppercase tracking-widest font-bold mb-8 text-stone-500">Shipping Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase text-stone-400 font-bold">Full Name</label>
                                    <input
                                        type="text"
                                        defaultValue={user?.name || ''}
                                        className="w-full border-b border-stone-200 py-3 focus:border-black outline-none transition-all text-sm bg-transparent"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase text-stone-400 font-bold">Phone Number</label>
                                    <input
                                        type="text"
                                        defaultValue={user?.phone || ''}
                                        className="w-full border-b border-stone-200 py-3 focus:border-black outline-none transition-all text-sm bg-transparent"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] uppercase text-stone-400 font-bold">Email Address</label>
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        className="w-full border-b border-stone-100 py-3 text-stone-400 outline-none text-sm bg-transparent cursor-not-allowed"
                                        readOnly
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] uppercase text-stone-400 font-bold">Shipping Address</label>
                                    <textarea
                                        rows={2}
                                        defaultValue={shippingAddress}
                                        onChange={(e) => setShippingAddress(e.target.value)}
                                        placeholder="Enter your full address here..."
                                        className="w-full border-b border-stone-200 py-3 focus:border-black outline-none transition-all text-sm resize-none bg-transparent"
                                    ></textarea>
                                    {/* Textarea Alamat */}
                                    {/* <textarea
                                        rows={2}
                                        value={shippingAddress}
                                        onChange={(e) => setShippingAddress(e.target.value)}
                                        placeholder="Enter your full address here..."
                                        className="w-full border-b border-stone-200 py-3 focus:border-black outline-none transition-all text-sm resize-none bg-transparent"
                                    ></textarea> */}

                                    <div className="md:col-span-2 space-y-2 mt-6">
                                        <label className="text-[10px] uppercase text-stone-400 font-bold tracking-widest">
                                            Shipping Notes (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Contoh: Titip di satpam atau warna pagar rumah..."
                                            value={catatan}
                                            onChange={(e) => setCatatan(e.target.value)}
                                            className="w-full border-b border-stone-200 py-3 focus:border-black outline-none transition-all text-sm bg-transparent placeholder:text-stone-300"
                                        />
                                    </div>
                                </div>

                            </div>
                        </section>
                    </div>

                    {/* Ringkasan Pesanan (Sama seperti Shopping Bag) */}
                    <div className="lg:col-span-5">
                        <div className="bg-stone-50/50 backdrop-blur-sm p-8 rounded-sm border border-stone-100 sticky top-10">
                            <h2 className="text-xs uppercase tracking-widest font-bold mb-8 text-stone-500 border-b border-stone-200 pb-4">
                                Your Order
                            </h2>

                            <div className="space-y-6 mb-10 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map((item) => (
                                    <div key={item.product_id} className="flex gap-4 items-center">
                                        <div className="relative w-14 h-16 bg-stone-200 shrink-0 overflow-hidden rounded-sm">
                                            <Image
                                                src={`/img/produk/${item.image}.jpeg`}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-xs uppercase font-bold tracking-tight text-stone-800">{item.name}</h4>
                                            <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <span className="text-xs font-medium">
                                            Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 border-t border-stone-200 pt-6 mb-8">
                                <div className="flex justify-between text-[10px] text-stone-500 uppercase tracking-[0.2em]">
                                    <span>Subtotal</span>
                                    <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between text-[10px] text-stone-500 uppercase tracking-[0.2em]">
                                    <span>Shipping</span>
                                    <span>Rp {shipping.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between text-base font-light pt-4 border-t border-stone-900 mt-4">
                                    <span className="uppercase tracking-tighter">Total</span>
                                    <span className="font-bold">Rp {total.toLocaleString('id-ID')}</span>
                                </div>
                            </div>

                            {/* Tombol dengan Informasi COD */}
                            {/* Tombol Complete Purchase */}
                            <button
                                onClick={handleCheckout}
                                disabled={isSubmitting}
                                className={`w-full bg-stone-900 text-white py-5 rounded-sm flex flex-col items-center justify-center gap-1 hover:bg-black transition-all active:scale-[0.98] shadow-lg group ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <span className="text-[10px] uppercase tracking-[0.3em] font-bold">
                                    {isSubmitting ? "Processing..." : "Complete Purchase"}
                                </span>
                                {!isSubmitting && (
                                    <span className="text-[9px] text-stone-400 uppercase tracking-[0.15em] font-medium group-hover:text-stone-300 transition-colors">
                                        Method: Cash on Delivery (COD)
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}