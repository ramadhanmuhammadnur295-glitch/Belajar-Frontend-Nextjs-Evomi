"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { useRouter } from "next/navigation";

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
  const [user, setUser] = useState<{ email: string; name: string; username: string; image: string; } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("access_token");
    const savedUser = localStorage.getItem("user_data");
    if (token && savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch (error) { console.error(error); }
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/products", { headers: { Accept: "application/json" } });
        const result = await response.json();
        setProducts(result.data ? result.data : result);
      } catch (error) { console.error(error); }
    };
    fetchProducts();
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
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_data");
      setUser(null);
      setIsMenuOpen(false); // Tutup menu saat logout
      router.refresh();
    }

    setIsMobileMenuOpen(false); // Tutup menu mobile saat logout
  };

  if (!mounted) return null;

  const topFourProducts = products.slice(0, 4);

  return (
    <div className={`${fontCaption.variable} ${fontJudul.variable} selection:bg-amber-100`}>
      <div className="min-h-screen bg-[#FBFBF9] text-stone-900 font-sans antialiased">

        {/* NAVBAR - Fixed Height and Fluid Spacing */}
        <nav className="fixed w-full z-[100] bg-[#0081D1] backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-8 h-20 flex items-center justify-between">

            {/* KIRI - LOGO */}
            <div className="flex-1 md:w-1/3 flex justify-start">
              <Link href="/" className="hover:opacity-70 transition-opacity">
                <Image
                  src="/img/Logo Evomi.png"
                  alt="Evomi Logo"
                  width={90}
                  height={36}
                  className="brightness-0 invert"
                />
              </Link>
            </div>

            {/* TENGAH - MENU UTAMA (Hidden on Mobile) */}
            <div className={`hidden md:flex w-1/3 justify-center items-center space-x-10 ${fontJudul.className} text-[13px] tracking-[0.2em] uppercase text-white`}>
              <a href="#about" className="hover:text-white/70 transition-colors">About</a>
              <a href="#product" className="hover:text-white/70 transition-colors">Collection</a>
              <Link href="/produk" className="hover:text-white/70 transition-colors">Shop</Link>
            </div>

            {/* KANAN - USER & HAMBURGER */}
            <div className="flex-1 md:w-1/3 flex justify-end items-center space-x-4">

              {/* Desktop User Menu (Hidden on Mobile) */}
              {/* NAVBAR ACTIONS */}
              <div className="flex items-center space-x-6 md:space-x-8">
                {user ? (
                  // Bagian User yang sudah Login (tetap seperti kode kamu sebelumnya)
                  <div className="relative">
                    <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="flex items-center space-x-3 border border-stone-200 rounded-full p-1 pr-4 bg-stone-100 hover:bg-stone-50 transition-all"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#0081D1] text-white flex items-center justify-center text-[10px] font-bold uppercase overflow-hidden">
                        {user.image != 'default-avatar.png' ? (
                          <img src={`http://127.0.0.1:8000/storage/profiles/${user.image}`} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          user.name.charAt(0)
                        )}
                      </div>
                      <span className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-stone-700">{user.username}</span>
                    </button>

                    {isMenuOpen && (
                      <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-stone-100 py-2 z-50 overflow-hidden font-sans">
                        <Link href="/profile" className="block px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-600 hover:bg-stone-50 transition-colors">Profile</Link>
                        <Link href="/orders" className="block px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-600 hover:bg-stone-50 transition-colors">Orders</Link>
                        <hr className="border-stone-50 my-1" />
                        <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors">Logout</button>
                      </div>
                    )}
                  </div>
                ) : (
                  // Tampilan LOGIN & REGISTER (Teks Putih + Gaya Menu Tengah)
                  <div className="flex items-center space-x-6">
                    <Link
                      href="/login"
                      className="relative text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:opacity-70 transition-all duration-300 group"
                    >
                      Login
                      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
                    </Link>

                    <Link
                      href="/register"
                      className="relative text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:opacity-70 transition-all duration-300 group"
                    >
                      Register
                      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </div>
                )}
              </div>

              {/* HAMBURGER BUTTON (Mobile Only) */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-white focus:outline-none"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* MOBILE MENU PANEL */}
          <div className={`md:hidden absolute top-20 left-0 w-full bg-[#0081D1] border-b border-white/10 transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-[100vh] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="px-8 py-10 flex flex-col space-y-8 bg-gradient-to-b from-[#0081D1] to-[#006bb0]">

              {/* Profile Section on Mobile Menu */}
              {user && (
                <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-2xl border border-white/10">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 shrink-0">
                    {user.image != 'default-avatar.png' ? (
                      <img src={`http://127.0.0.1:8000/storage/profiles/${user.image}`} alt="test" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-white text-[#0081D1] text-xl font-bold">{user.name.charAt(0)}</div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-lg leading-tight">{user.name}</span>
                    <span className="text-white/60 text-sm italic">@{user.username}</span>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className={`${fontJudul.className} flex flex-col space-y-5 text-lg tracking-[0.2em] uppercase text-white`}>
                {/* Menu Utama - Diperkecil dari text-2xl ke text-lg */}
                <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white/60 transition-colors">About</a>
                <a href="#product" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white/60 transition-colors">Collection</a>
                <Link href="/produk" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white/60 transition-colors">Shop</Link>

                {user ? (
                  <>
                    <div className="h-[1px] bg-white/10 w-full my-1"></div>
                    {/* Menu User - Diperkecil dari text-lg ke text-sm */}
                    <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-sm opacity-70 font-sans tracking-widest">My Profile</Link>
                    <button onClick={handleLogout} className="text-sm text-red-300/80 text-left font-sans tracking-widest">Logout</button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="bg-white text-[#0081D1] text-center py-3 rounded-xl font-bold text-[10px] tracking-widest mt-2">Login / Register</Link>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* HERO SECTION - Adjusted Typography for Mobile */}
        <section className="relative min-h-screen flex flex-col items-center justify-center bg-white px-6 overflow-hidden">
          {/* Tambahkan padding top (pt-20) untuk mengimbangi tinggi navbar agar konten benar-benar di tengah area yang terlihat */}
          <div className="relative z-10 text-center space-y-6 md:space-y-8 max-w-4xl pt-20">
            <div className="space-y-2 md:space-y-4">
              <p className="text-stone-400 tracking-[0.3em] md:tracking-[0.5em] uppercase text-[9px] md:text-xs">
                The Artisan Fragrance House
              </p>
              <h1 className={`${fontJudul.className} text-5xl sm:text-7xl md:text-[120px] leading-tight md:leading-none text-stone-900 tracking-tighter uppercase`}>
                EVOMI
              </h1>
              <p className="text-stone-500 text-xs md:text-base font-light leading-relaxed max-w-xs md:max-w-xl mx-auto italic">
                "Kurasi aroma yang melampaui waktu. Kami meracik memori dalam setiap tetes esens organik."
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
              <Link href="/produk" className="w-full sm:w-auto bg-stone-900 text-white px-8 md:px-10 py-3 md:py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#0081D1] transition-all">
                Explore Collection
              </Link>
              <Link href="#about" className="text-stone-900 border-b border-stone-900 pb-1 text-[10px] font-bold uppercase tracking-widest">
                Our Story
              </Link>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION - Stacked on Mobile */}
        <section id="about" className="py-20 md:py-32 px-6 md:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
            <div className="md:col-span-4 text-center md:text-left">
              <h2 className={`${fontJudul.className} text-3xl md:text-4xl text-stone-900 leading-tight uppercase`}>Crafting <br className="hidden md:block" /> Memories</h2>
            </div>
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
              <div className="space-y-3">
                <h3 className="font-bold text-amber-900 uppercase tracking-widest text-[10px]">Pionir Wewangian</h3>
                <p className="text-stone-600 text-sm md:text-base leading-relaxed font-light">Evomi memadukan botani langka dengan teknik ekstraksi modern untuk karakter aroma unik.</p>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-amber-900 uppercase tracking-widest text-[10px]">Eksklusivitas</h3>
                <p className="text-stone-600 text-sm md:text-base leading-relaxed font-light">Setiap batch diproduksi terbatas untuk menjamin kualitas material organik tetap terjaga.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCT GRID - Optimized Columns */}
        <section id="product" className="py-12 md:py-32 px-4 md:px-8 bg-white border-y border-stone-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10 md:mb-20 space-y-3">
              <h2 className={`${fontJudul.className} text-3xl md:text-6xl uppercase tracking-tighter text-stone-800`}>Signature Essence</h2>
              <div className="flex items-center justify-center space-x-3">
                <div className="w-6 md:w-8 h-[1px] bg-stone-200"></div>
                <p className="text-stone-400 tracking-[0.2em] uppercase text-[8px] md:text-xs">Featured Collection</p>
                <div className="w-6 md:w-8 h-[1px] bg-stone-200"></div>
              </div>
            </div>

            {/* GRID: Menggunakan 2 kolom di mobile (grid-cols-2) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-10">
              {topFourProducts.map((parfum) => (
                <div key={parfum.id} className="group">
                  <div className="relative aspect-[4/5] overflow-hidden bg-stone-100 mb-3 rounded-2xl border border-stone-50 transition-all duration-500 hover:shadow-sm">
                    <Image
                      src={parfum.image_url || "/img/placeholder.jpg"}
                      alt={parfum.nama}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Overlay Lihat Detail: Disembunyikan di mobile agar tidak mengganggu tap, muncul di desktop */}
                    <Link href={`/produk/${parfum.id}`} className="absolute inset-0 z-10 opacity-0 md:group-hover:opacity-100 bg-black/5 transition-opacity flex items-end p-2 md:p-4">
                      <div className="w-full bg-white/90 backdrop-blur py-2 md:py-3 text-[8px] md:text-[9px] uppercase font-bold tracking-widest text-center translate-y-2 group-hover:translate-y-0 transition-transform rounded-lg">
                        Lihat Detail
                      </div>
                    </Link>
                  </div>

                  <div className="text-center space-y-1 px-1">
                    <span className="text-[7px] md:text-[9px] text-stone-400 uppercase tracking-widest">Unisex • {parfum.ukuran}</span>
                    <h3 className={`${fontJudul.className} text-sm md:text-xl text-stone-800 uppercase leading-tight line-clamp-1`}>
                      {parfum.nama}
                    </h3>
                    <p className="text-stone-900 font-semibold text-[10px] md:text-sm">
                      Rp {Number(parfum.harga_retail).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STATS SECTION - 2 columns on mobile */}
        <section className="py-16 md:py-32 bg-stone-50 px-6 text-center">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { title: "12H+", desc: "Projection" },
              { title: "Artisan", desc: "Batch" },
              { title: "Recycled", desc: "Glass" },
              { title: "Organic", desc: "Essence" },
            ].map((item, i) => (
              <div key={i}>
                <div className={`${fontJudul.className} text-2xl md:text-3xl mb-1 text-stone-300 hover:text-amber-800 transition-colors`}>{item.title}</div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-stone-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIAL - Stacked for readability */}
        <section className="py-20 md:py-32 bg-stone-900 text-white px-6">
          <div className="max-w-5xl mx-auto text-center space-y-12 md:space-y-16">
            <h2 className={`${fontJudul.className} text-2xl md:text-5xl italic leading-tight text-stone-200`}>"The scent of a woman, <br /> The presence of a soul."</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
              {[
                { name: "Clara S.", text: "Peaceful Calm adalah aroma paling segar yang pernah saya miliki." },
                { name: "Dimas R.", text: "Rabel Brave sangat memikat perhatian di malam hari." },
                { name: "Sarah W.", text: "Packaging Evomi sangat mewah, benar-benar brand berkelas." },
              ].map((t, i) => (
                <div key={i} className="space-y-4">
                  <p className="text-stone-400 text-sm md:text-base font-light italic leading-relaxed">"{t.text}"</p>
                  <div className="text-[9px] uppercase tracking-[0.3em] font-bold text-amber-500">— {t.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER - Stacked for mobile */}
        <footer className="bg-white pt-16 pb-8 px-6 md:px-8 border-t border-stone-100">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-16">
            <div className="sm:col-span-2">
              <h2 className={`${fontJudul.className} text-2xl mb-4 tracking-widest`}>EVOMI</h2>
              <p className="max-w-xs text-stone-400 text-sm font-light leading-relaxed">Menghadirkan pengalaman sensorik melalui kurasi aroma terbaik.</p>
            </div>
            <div>
              <h4 className="font-bold text-[10px] uppercase tracking-widest mb-4">Contact</h4>
              <ul className="text-stone-500 space-y-2 text-xs">
                <li>hello@evomi.com</li>
                <li>Jakarta, Indonesia</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[10px] uppercase tracking-widest mb-4">Newsletter</h4>
              <div className="flex border-b border-stone-200 pb-2 max-w-xs">
                <input type="email" placeholder="Email address" className="bg-transparent w-full text-xs outline-none" />
                <button className="text-[9px] uppercase font-bold">Join</button>
              </div>
            </div>
          </div>
          <div className="text-center text-[9px] text-stone-300 uppercase tracking-[0.3em] pt-8 border-t border-stone-50">
            &copy; {new Date().getFullYear()} EVOMI FRAGRANCE HOUSE
          </div>
        </footer>
      </div>
    </div>
  );
}