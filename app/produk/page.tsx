"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";

// --- Font Configuration ---
const fontJudul = localFont({
  src: "./../fonts/8 Heavy.ttf",
  variable: "--font-brand",
  display: "swap",
});

const fontCaption = localFont({
  src: "./../fonts/Nohemi-Regular.otf",
  variable: "--font-body",
  display: "swap",
});

// Komponen Card yang disesuaikan dengan field Database/API
const ProductCard = ({ parfum }: { parfum: any }) => {
  return (
    <div className="group flex flex-col bg-white border border-stone-100 rounded-2xl hover:shadow-2xl hover:shadow-stone-200/50 transition-all duration-700">
      {/* Image Area */}
      <div className="relative w-full h-[400px] bg-stone-100">
        <Image
          src={parfum.image_url || "/img/placeholder.jpg"}
          alt={parfum.nama}
          fill
          unoptimized
          className="object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        <div className="absolute top-6 left-6">
          <span className="bg-white/90 backdrop-blur-md text-stone-800 text-[10px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-full font-bold shadow-sm">
            EDP • {parfum.ukuran || "50ML"}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-8 flex flex-col flex-grow text-center">
        <div className="mb-4">
          <h3
            className={`${fontJudul.className} text-2xl text-stone-900 mb-2 group-hover:text-amber-800 transition-colors`}
          >
            {parfum.nama}
          </h3>
          <div className="h-0.5 w-10 bg-amber-200 mx-auto group-hover:w-20 transition-all duration-500"></div>
        </div>

        <p className="text-[12px] text-stone-500 leading-relaxed mb-8 line-clamp-2 italic font-light">
          &quot;
          {parfum.deskripsi ||
            "A signature masterpiece crafted for your identity."}
          &quot;
        </p>

        <div className="mt-auto flex flex-col items-center gap-4">
          <p className="text-xl font-medium text-stone-900">
            IDR {Number(parfum.harga_retail).toLocaleString("id-ID")}
          </p>

          <Link
            href={`/produk/${parfum.id}`}
            className="w-full py-4 bg-stone-900 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-900 transition-all duration-300 rounded-xl"
          >
            Explore Scent
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/products", {
          headers: { Accept: "application/json" },
        });
        const result = await response.json();

        setProducts(result.data || result || []);
        // const data = await response.json();
        // setProducts(data.data || data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div
      className={`${fontJudul.variable} ${fontCaption.variable} font-body bg-[#FDFCFB] selection:bg-amber-100`}
    >
      {/* NAVBAR */}
      <nav className="fixed w-full z-900 bg-white/80 backdrop-blur-xl border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <Link href="/" className="hover:opacity-70 transition-opacity">
            <Image
              src="/img/Logo Evomi.png"
              alt="Evomi"
              width={110}
              height={40}
              className="brightness-0"
            />
          </Link>
          <div className="hidden md:flex space-x-10 text-[10px] uppercase tracking-[0.3em] font-bold text-stone-500">
            <Link href="/" className="hover:text-stone-900 transition-colors">
              Home
            </Link>
            <Link href="/produk" className="text-amber-800">
              Collections
            </Link>
            <Link
              href="#footer"
              className="hover:text-stone-900 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO / HEADER SECTION */}
      <section className="pt-44 pb-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-[10px] uppercase tracking-[0.5em] text-amber-700 mb-6 font-bold">
            The Art of Fragrance
          </span>
          <h1
            className={`${fontJudul.className} text-5xl md:text-7xl text-stone-900 mb-8 leading-tight`}
          >
            Our Collections
          </h1>
          <p className="text-stone-500 max-w-xl mx-auto leading-relaxed text-sm md:text-base font-light">
            Dikurasi dengan bahan-bahan organik terbaik untuk menciptakan jejak
            aroma yang tak terlupakan. Temukan identitas Anda melalui koleksi
            kami.
          </p>
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="pb-32 px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-[600px] bg-stone-100 animate-pulse rounded-2xl"
                ></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {products.map((parfum: any) => (
                <ProductCard key={parfum.id} parfum={parfum} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer id="footer" className="bg-stone-900 text-stone-400 py-24 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-20">
          <div className="space-y-8">
            <Image
              src="/img/Logo Evomi.png"
              alt="Evomi"
              width={120}
              height={40}
              className="invert brightness-0"
            />
            <p className="italic text-sm leading-relaxed">
              &quot;Redefining Presence through Scent.&quot; Identitas yang
              tidak terlihat namun paling berkesan.
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="text-white text-xs uppercase tracking-[0.2em] font-bold">
              Location
            </h4>
            <p className="text-sm">
              Jakarta, Indonesia
              <br />
              Sudirman Central Business District
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="text-white text-xs uppercase tracking-[0.2em] font-bold">
              Connect
            </h4>
            <div className="flex flex-col gap-4 text-sm">
              <a href="#" className="hover:text-white transition-colors">
                Instagram
              </a>
              <a href="#" className="hover:text-white transition-colors">
                TikTok
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-[9px] uppercase tracking-widest flex justify-between">
          <p>© {new Date().getFullYear()} EVOMI FRAGRANCE.</p>
          <p>Handcrafted in Indonesia</p>
        </div>
      </footer>
    </div>
  );
}
