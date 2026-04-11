"use client"; // Diubah ke client component untuk handle auth state

import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import evomiData from "../data/evomi.json";
import ImageCarousel from "@/components/ImageCarousel";
import localFont from "next/font/local";
import { useRouter } from "next/navigation";

// Inisialisasi Font
const fontJudul = localFont({
  src: "./fonts/8 Heavy.ttf",
  variable: "--font-brand",
  display: "swap",
});

const fontCaption = localFont({
  src: "./fonts/Nohemi-Regular.otf",
  variable: "--font-body",
  display: "swap",
});

export default function EvomiLandingPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    email: string;
    name: string;
    username: string;
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 1. Ambil token dan data user dari localStorage
    const token = localStorage.getItem("access_token");
    const savedUser = localStorage.getItem("user_data");

    // 2. Jika keduanya ada, masukkan ke dalam state
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Gagal membaca data user", error);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      // Hapus semua data saat logout
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_data");
      setUser(null);
      router.refresh();
    }
  };

  if (!mounted) return null;

  const topFourProducts = evomiData.kategori_produk.slice(0, 4);

  return (
    <div
      className={`${fontCaption.variable} ${fontJudul.variable} selection:bg-amber-100`}
    >
      <Head>
        <title>Evomi Fragrance | Redefining Presence</title>
        <meta
          name="description"
          content="Artisan perfume house based in Jakarta"
        />
      </Head>

      <div className="min-h-screen bg-[#FBFBF9] text-stone-900 font-sans antialiased">
        {/* NAVBAR */}
        <nav className="fixed w-full z-50 bg-[#0081D1] backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
            {/* KIRI - LOGO */}
            <div className="w-1/3 flex justify-start">
              <Link href="/" className="hover:opacity-70 transition-opacity">
                <Image
                  src="/img/Logo Evomi.png"
                  alt="Evomi Logo"
                  width={100}
                  height={40}
                  className="brightness-0 invert"
                />
              </Link>
            </div>

            {/* TENGAH - MENU UTAMA */}
            <div
              className={`hidden md:flex w-1/3 justify-center items-center space-x-10 ${fontJudul.className} text-[13px] tracking-[0.2em] uppercase text-white`}
            >
              <a
                href="#about"
                className="hover:text-white/70 transition-colors"
              >
                About
              </a>
              <a
                href="#product"
                className="hover:text-white/70 transition-colors"
              >
                Collection
              </a>
              <Link
                href="/produk"
                className="hover:text-white/70 transition-colors"
              >
                Shop
              </Link>
            </div>

            {/* KANAN - USERNAME & LOGOUT */}
            <div
              className={`hidden md:flex w-1/3 justify-end items-center space-x-6 ${fontJudul.className} text-[11px] tracking-[0.15em] uppercase text-white`}
            >
              {user ? (
                <div className="flex items-center space-x-6">
                  {/* Tampilan Baru: @username */}
                  <span className="opacity-90 lowercase font-sans font-medium tracking-normal border-b border-white/20 pb-0.5">
                    @{user.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-white text-[#0081D1] px-6 py-2 hover:bg-red-50 hover:text-red-600 transition-all rounded-full font-bold"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hover:text-white/70 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className="bg-white text-[#0081D1] px-7 py-2.5 hover:bg-stone-100 transition-all rounded-full font-bold"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* MOBILE MENU TOGGLE */}
            <div className="md:hidden flex justify-end w-1/3 text-white">
              <button className="p-2">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    strokeWidth="1.5"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* HERO SECTION */}
        <section className="relative h-screen flex items-center justify-center bg-white overflow-hidden">
          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              {/* Sub-header */}
              <p className="text-stone-400 tracking-[0.5em] uppercase text-[10px] md:text-xs">
                The Artisan Fragrance House
              </p>

              {/* Judul Utama */}
              <h1
                className={`${fontJudul.className} text-7xl md:text-[120px] leading-none text-stone-900 tracking-tighter uppercase`}
              >
                EVOMI
              </h1>

              {/* DESKRIPSI BARU */}
              <p className="text-stone-500 text-sm md:text-base font-light leading-relaxed max-w-xl mx-auto italic">
                "Kurasi aroma yang melampaui waktu. Kami meracik memori dalam
                setiap tetes esens organik, menghadirkan kemewahan alam yang
                tenang ke dalam ruang personal Anda."
              </p>
            </div>

            {/* Tombol Aksi */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-4">
              <Link
                href="/produk"
                className="bg-stone-900 text-white px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#0081D1] transition-all duration-300 shadow-lg shadow-stone-200"
              >
                Explore Collection
              </Link>

              <Link
                href="#about"
                className="text-stone-900 border-b border-stone-900 pb-1 text-[10px] font-bold uppercase tracking-widest hover:text-[#0081D1] hover:border-[#0081D1] transition-all duration-300"
              >
                Our Story
              </Link>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-4">
            <div className="w-[1px] h-16 bg-gradient-to-b from-stone-300 to-transparent"></div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="py-32 px-8 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-16 items-center">
            <div className="md:col-span-4">
              {/* text-stone-900 membuat tulisan menjadi hitam pekat dan elegan */}
              <h2
                className={`${fontJudul.className} text-4xl text-stone-900 leading-tight uppercase`}
              >
                Crafting <br /> Memories
              </h2>
            </div>
            <div className="md:col-span-8 grid md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h3 className="font-bold text-amber-900 uppercase tracking-widest text-xs">
                  Pionir Wewangian
                </h3>
                <p className="text-stone-600 leading-relaxed font-light">
                  Evomi memadukan botani langka dengan teknik ekstraksi modern
                  untuk menciptakan karakter aroma yang tidak ditemukan di
                  tempat lain.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-amber-900 uppercase tracking-widest text-xs">
                  Eksklusivitas
                </h3>
                <p className="text-stone-600 leading-relaxed font-light">
                  Setiap batch diproduksi secara terbatas untuk menjamin
                  kualitas material organik tetap terjaga hingga ke tangan Anda.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CAMPAIGN */}
        <section className="bg-stone-50 py-24">
          <div className="max-w-screen-2xl mx-auto px-4">
            {/* JUDUL CAMPAIGN */}
            <div className="flex flex-col items-center text-center mb-16 space-y-3">
              <span className="text-[#0081D1] tracking-[0.4em] uppercase text-[10px] font-bold">
                Editorial
              </span>
              <h2
                className={`${fontJudul.className} text-4xl md:text-6xl text-stone-900 uppercase tracking-tighter`}
              >
                The Seasonal{" "}
                <span className="italic font-light text-stone-400">
                  Campaign
                </span>
              </h2>
              <p className="text-stone-500 text-sm max-w-lg font-light leading-relaxed">
                Menangkap esensi kemewahan dalam setiap bingkai. Jelajahi cerita
                di balik koleksi terbaru kami melalui lensa artistik.
              </p>
            </div>

            {/* CAROUSEL COMPONENT */}
            <ImageCarousel />
          </div>
        </section>

        {/* PRODUCT SECTION */}
        <section id="product" className="py-32 px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            {/* HEADER: Sekarang Centered */}
            <div className="flex flex-col items-center text-center mb-20 space-y-4">
              <div className="space-y-2">
                <h2
                  className={`${fontJudul.className} text-5xl md:text-6xl uppercase tracking-tighter text-stone-800`}
                >
                  Signature Essence
                </h2>
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-8 h-[1px] bg-stone-200"></div>
                  <p className="text-stone-400 tracking-[0.3em] uppercase text-[10px] md:text-xs">
                    Featured Collection
                  </p>
                  <div className="w-8 h-[1px] bg-stone-200"></div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/produk"
                  className="text-stone-400 hover:text-stone-900 transition-colors uppercase text-[10px] tracking-widest border-b border-stone-200 pb-1"
                >
                  View All Collection
                </Link>
              </div>
            </div>

            {/* GRID PRODUK (Tetap sama) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {topFourProducts.map((parfum) => (
                <div key={parfum.id} className="group cursor-pointer">
                  {/* ... (Konten produk Anda tetap sama seperti sebelumnya) ... */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-6">
                    <Image
                      src={`/img/produk/${parfum.media.artboard_ref}.jpeg`}
                      alt={parfum.nama}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                    <div className="absolute bottom-4 left-4 right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <Link
                        href={`/produk/${parfum.id}`}
                        className="block w-full bg-white/90 backdrop-blur text-center py-3 text-[10px] uppercase font-bold tracking-widest text-stone-900"
                      >
                        Lihat Detail
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-2 text-center">
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest">
                      {parfum.spesifikasi.gender} • {parfum.spesifikasi.ukuran}
                    </span>
                    <h3
                      className={`${fontJudul.className} text-xl text-stone-800`}
                    >
                      {parfum.nama}
                    </h3>
                    <p className="text-stone-500 text-sm font-light italic">
                      {parfum.profil_aroma.karakter.slice(0, 3).join(" • ")}
                    </p>
                    <p className="text-stone-900 font-medium pt-2">
                      Rp {parfum.transaksi.harga_retail.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section id="why" className="py-32 bg-stone-50 px-8 text-center">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { title: "12H+", desc: "Projection" },
              { title: "Artisan", desc: "Batch" },
              { title: "Recycled", desc: "Glass" },
              { title: "Organic", desc: "Essence" },
            ].map((item, i) => (
              <div key={i} className="group">
                <div
                  className={`${fontJudul.className} text-3xl mb-2 text-stone-300 group-hover:text-amber-800 transition-colors`}
                >
                  {item.title}
                </div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIAL */}
        <section className="py-32 bg-stone-900 text-white px-8">
          <div className="max-w-5xl mx-auto text-center space-y-16">
            <div className="space-y-4">
              <div className="w-12 h-[1px] bg-amber-500 mx-auto"></div>
              <h2
                className={`${fontJudul.className} text-3xl md:text-5xl italic font-serif leading-tight text-stone-200`}
              >
                "The scent of a woman, <br /> The presence of a soul."
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-16">
              {[
                {
                  name: "Clara S.",
                  text: "Peaceful Calm adalah aroma paling segar yang pernah saya miliki.",
                },
                {
                  name: "Dimas R.",
                  text: "Rabel Brave sangat memikat perhatian di malam hari.",
                },
                {
                  name: "Sarah W.",
                  text: "Packaging Evomi sangat mewah, benar-benar brand berkelas.",
                },
              ].map((t, i) => (
                <div key={i} className="space-y-6 group">
                  <p className="text-stone-400 font-light leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">
                    "{t.text}"
                  </p>
                  <div className="text-[10px] uppercase tracking-[0.4em] font-bold text-amber-500">
                    — {t.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-white pt-24 pb-12 px-8 border-t border-stone-100">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
              <h2
                className={`${fontJudul.className} text-3xl mb-6 tracking-widest`}
              >
                {evomiData.brand.toUpperCase()}
              </h2>
              <p className="max-w-xs text-stone-400 font-light leading-relaxed">
                Menghadirkan pengalaman sensorik melalui kurasi aroma terbaik.
                Bergabunglah dengan perjalanan kami.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-6">
                Contact
              </h4>
              <ul className="text-stone-500 space-y-3 text-sm font-light">
                <li>hello@evomi.com</li>
                <li>Jakarta, Indonesia</li>
                <li className="pt-4 flex space-x-4">
                  <a href="#" className="hover:text-stone-900">
                    IG
                  </a>
                  <a href="#" className="hover:text-stone-900">
                    TW
                  </a>
                  <a href="#" className="hover:text-stone-900">
                    TK
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-6">
                Newsletter
              </h4>
              <div className="flex border-b border-stone-200 pb-2">
                <input
                  type="email"
                  placeholder="Email address"
                  className="bg-transparent w-full text-sm outline-none"
                />
                <button className="text-[10px] uppercase tracking-widest font-bold">
                  Join
                </button>
              </div>
            </div>
          </div>
          <div className="text-center text-[10px] text-stone-300 uppercase tracking-[0.5em] pt-12 border-t border-stone-50">
            &copy; {new Date().getFullYear()} {evomiData.brand.toUpperCase()}{" "}
            FRAGRANCE HOUSE
          </div>
        </footer>
      </div>
    </div>
  );
}
