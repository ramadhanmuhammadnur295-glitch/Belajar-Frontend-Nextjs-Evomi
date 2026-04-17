"use client"; // Diubah ke client component untuk fetch data

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import localFont from "next/font/local";
import AddToCartButton from "@/components/AddToCartButton";

// Konfigurasi Font
const fontJudul = localFont({
  src: "./../../fonts/8 Heavy.ttf",
  variable: "--font-brand",
  display: "swap",
});

const fontCaption = localFont({
  src: "./../../fonts/Nohemi-Regular.otf",
  variable: "--font-body",
  display: "swap",
});

interface ProductDetailProps {
  params: Promise<{ id: string }>; // Next.js 15 pattern
}

export default function ProductDetailPage({ params }: ProductDetailProps) {
  // const [produk, setProduk] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // const [showModal, setShowModal] = useState(false); // State untuk Modal

  const [showModal, setShowModal] = useState(false);
  const [produk, setProduk] = useState<any>(null);

  useEffect(() => {
    const getDetail = async () => {
      try {
        const resolvedParams = await params;
        const response = await fetch(
          `http://localhost:8000/api/products/${resolvedParams.id}`,
          {
            headers: {
              Accept: "application/json",
            },
          },
        );

        if (!response.ok) {
          setError(true);
          return;
        }

        const result = await response.json();
        // Laravel biasanya mengembalikan { data: {...} } atau langsung {...}
        setProduk(result.data ? result.data : result);
      } catch (err) {
        console.error("Error fetching detail:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    getDetail();
  }, [params]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (error || !produk) return notFound();

  return (
    <div
      className={`${fontCaption.variable} min-h-screen bg-stone-50 text-stone-900 font-sans`}
    >
      {/* MODAL POPUP SUCCESS */}
      {/* --- UI MODAL BARU --- */}
      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
          {/* Backdrop dengan Blur Mewah */}
          <div
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-md transition-opacity duration-500"
            onClick={() => setShowModal(false)}
          />

          {/* Box Modal */}
          <div className="relative bg-white w-full max-w-sm rounded-[2rem] p-10 shadow-2xl border border-stone-100 transform transition-all scale-100 animate-in fade-in zoom-in duration-300">
            <div className="text-center">
              {/* Icon Centang Elegan */}
              <div className="w-20 h-20 bg-stone-50 border border-stone-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-stone-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-stone-900 mb-2 uppercase tracking-tighter">
                Scent Added
              </h2>
              <p className="text-stone-500 text-sm mb-10 leading-relaxed font-light">
                {produk?.nama} telah masuk ke dalam daftar koleksi Anda.
              </p>

              <div className="space-y-3">
                <Link
                  href="/profile"
                  className="block w-full bg-stone-900 text-white py-4 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-900 transition-colors"
                >
                  View Shopping Bag
                </Link>
                <button
                  onClick={() => setShowModal(false)}
                  className="block w-full text-stone-400 py-2 text-[10px] uppercase tracking-[0.2em] font-medium hover:text-stone-900 transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      {/* NAVBAR */}
      <nav className="fixed w-full z-50 bg-[#0081D1] backdrop-blur-md border-b border-blue-800/20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Image
              src="/img/Logo Evomi.png"
              alt="Evomi Logo"
              // Menambahkan filter agar logo menjadi putih supaya kontras dengan bg biru
              className="brightness-0 invert"
              width={100}
              height={40}
              priority
            />
          </Link>
          <Link
            href="/#product"
            className={`${fontCaption.className} text-xs uppercase tracking-widest text-white/70 hover:text-white transition`}
          >
            ← Back to Collections
          </Link>
        </div>
      </nav>

      <main className="pt-28 pb-24 px-6 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div
          className={`${fontCaption.className} text-xs uppercase tracking-widest text-stone-400 mb-8`}
        >
          <Link href="/" className="hover:text-stone-900">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-stone-900">{produk.nama}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* KIRI: PRODUCT IMAGE */}
          <div className="relative w-full h-[500px] lg:h-[700px] bg-stone-100 rounded-2xl overflow-hidden sticky top-28">
            <Image
              src={produk.image_url || "/img/placeholder.jpg"}
              alt={produk.nama}
              fill
              unoptimized
              priority
              className="object-cover"
            />
          </div>

          {/* KANAN: PRODUCT DETAILS */}
          <div className="flex flex-col justify-center">
            <div className="mb-8 border-b border-stone-200 pb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-stone-200 text-stone-700 text-xs px-3 py-1 rounded-full uppercase tracking-widest font-medium">
                  Unisex
                </span>
                <span className="text-stone-500 text-sm tracking-wider uppercase">
                  Eau De Parfum • {produk.ukuran}
                </span>
              </div>

              <h1
                className={`${fontJudul.className} text-5xl md:text-6xl text-stone-800 font-serif mb-4`}
              >
                {produk.nama}
              </h1>

              <p className="text-3xl font-light text-stone-900 mb-6">
                Rp {Number(produk.harga_retail).toLocaleString("id-ID")}
              </p>

              <p className="text-stone-600 leading-relaxed mb-6 italic">
                &quot;
                {produk.deskripsi ||
                  "Koleksi aroma terbaik dari Evomi Fragrance."}
                &quot;
              </p>
            </div>

            {/* OLFACTORY NOTES (Contoh jika data flat, kita tampilkan deskripsi kembali atau data statis) */}
            <div className="mb-10">
              <h3
                className={`${fontJudul.className} text-xl text-stone-600 mb-6 uppercase tracking-widest`}
              >
                Information
              </h3>
              <div className="bg-white border border-stone-100 p-6 rounded-lg shadow-sm">
                <p className="text-stone-600 text-sm leading-relaxed">
                  Produk ini merupakan bagian dari koleksi signature Evomi yang
                  diracik dengan bahan-bahan organik pilihan.
                </p>
              </div>
            </div>

            {/* ADD TO CART & STOCK */}
            <div className="mt-auto">
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`${fontCaption.className} text-sm text-stone-500`}
                >
                  Status:{" "}
                  <span className="text-emerald-600 font-medium">
                    {produk.status_stok || "In Stock"}
                  </span>
                </span>
              </div>

              <AddToCartButton
                productId={produk.id}
                productName={produk.nama}
                price={produk.harga_retail}
                image={produk.image_url}
                stock={99} // Bisa disesuaikan jika ada kolom stok di DB
                onSuccess={() => setShowModal(true)} // AKTIFKAN MODAL DISINI
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
