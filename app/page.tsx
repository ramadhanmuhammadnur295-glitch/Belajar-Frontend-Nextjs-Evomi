"use client";

// React & Next
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { useRouter } from "next/navigation";
import { motion, Variants, useScroll, useTransform } from "framer-motion";

import ImageCarousel from "@/components/ImageCarousel";
import { SocialIcon } from 'react-social-icons'

// ... import lainnya
import QuizModal from "@/components/QuizModal";


// --- Animasi Variants ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }
  }
};

// 
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    }
  }
};

// Font untuk judul
const fontJudul = localFont({
  src: "./fonts/8 Heavy.ttf",
  variable: "--font-brand",
  display: "swap",
});

// Font untuk caption
const fontCaption = localFont({
  src: "./fonts/Nohemi-Regular.otf",
  variable: "--font-body",
  display: "swap",
});

// Component utama
export default function EvomiLandingPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; name: string; username: string; image: string; } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // --- Parallax Hooks ---
  const heroRef = useRef(null);
  const { scrollYProgress: heroScrollY } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  // Teks turun lebih lambat dari scroll (efek tertinggal)
  const heroTextY = useTransform(heroScrollY, [0, 1], ["0%", "60%"]);
  // Background turun sedikit agar terlihat berdimensi
  const heroBgY = useTransform(heroScrollY, [0, 1], ["0%", "20%"]);

  const testimonialRef = useRef(null);
  const { scrollYProgress: testimonialScrollY } = useScroll({
    target: testimonialRef,
    offset: ["start end", "end start"],
  });
  // Cahaya blur bergerak naik turun saat scroll
  const testimonialGlowY = useTransform(testimonialScrollY, [0, 1], ["-40%", "40%"]);
  // ----------------------

  // Effect untuk inisialisasi
  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("access_token");
    const savedUser = localStorage.getItem("user_data");
    if (token && savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch (error) { console.error(error); }
    }

    // Fetch products
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/products", { headers: { Accept: "application/json" } });
        const result = await response.json();
        setProducts(result.data ? result.data : result);
      } catch (error) { console.error(error); }
    };
    fetchProducts();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_data");
      setUser(null);
      setIsMenuOpen(false);
      router.refresh();
    }
    setIsMobileMenuOpen(false);
  };

  // Get top 4 products
  const topFourProducts = products.slice(0, 4);

  return (
    <div style={{ opacity: mounted ? 1 : 0 }} className={`${fontCaption.variable} ${fontJudul.variable} selection:bg-amber-200 selection:text-stone-900 transition-opacity duration-500`}>

      {/* FLOATING ACTION BUTTON (WHATSAPP/CHAT) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8, type: "spring", bounce: 0.5 }}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[90]"
      >
        {/* Ganti <a> eksternal dengan <div> agar tidak terjadi nesting anchor */}
        <div className="relative flex items-center justify-center w-14 h-14 bg-stone-900 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-300 group">

          <span className="absolute inset-0 rounded-full bg-stone-500 opacity-20 animate-ping group-hover:animate-none"></span>

          {/* Gunakan properti 'url' langsung di SocialIcon. Ini akan merender SATU tag <a> saja */}
          <SocialIcon
            url="https://wa.me/62800000000" // Link WhatsApp pindah ke sini
            network="whatsapp"
            target="_blank"
            rel="noopener noreferrer"
            fgColor="#FBFBF9"
            bgColor="transparent"
            style={{ height: 32, width: 32 }}
            className="relative z-10"
          />

          <span className="absolute right-16 px-4 py-2.5 bg-white text-stone-800 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 shadow-xl border border-stone-100 whitespace-nowrap translate-x-2 group-hover:translate-x-0">
            Chat Admin
          </span>
        </div>
      </motion.div>

      {/* Komponen Modal */}
      <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />

      <div className="min-h-screen bg-[#FBFBF9] text-stone-900 font-sans antialiased">

        {/* NAVBAR */}
        <nav className="fixed w-full z-[100] bg-stone-900/80 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.05)] transition-all duration-300">
          <div className="max-w-7xl mx-auto px-6 md:px-8 h-20 flex items-center justify-between">
            <div className="flex-1 md:w-1/3 flex justify-start">
              <Link href="/" className="hover:opacity-70 transition-opacity">
                <Image src="/img/Logo Evomi.png" alt="Evomi Logo" width={90} height={36} className="brightness-0 invert drop-shadow-sm" />
              </Link>
            </div>
            <div className={`hidden md:flex w-1/3 justify-center items-center space-x-10 ${fontJudul.className} text-[13px] tracking-[0.2em] uppercase text-white/90`}>
              <a href="#about" className="hover:text-amber-200 transition-colors duration-300">About</a>
              <a href="#product" className="hover:text-amber-200 transition-colors duration-300">Collection</a>
              <Link href="/produk" className="hover:text-amber-200 transition-colors duration-300">Shop</Link>
              <Link href="" onClick={() => setIsQuizOpen(true)} className="hover:text-amber-200 transition-colors duration-300">Quiz</Link>
            </div>
            <div className="flex-1 md:w-1/3 flex justify-end items-center space-x-4">
              <div className="flex items-center space-x-6 md:space-x-8">
                {user ? (
                  <div className="relative">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-3 border border-stone-600/50 rounded-full p-1 pr-4 bg-stone-800/50 hover:bg-stone-700/50 transition-all duration-300 backdrop-blur-sm">
                      <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-900 flex items-center justify-center text-[10px] font-bold uppercase overflow-hidden shadow-sm">
                        {user.image !== 'default-avatar.png' ? (
                          <img src={`http://127.0.0.1:8000/storage/profiles/${user.image}`} alt="Profile" className="w-full h-full object-cover" />
                        ) : (user.name.charAt(0))}
                      </div>
                      <span className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-stone-200">{user.username}</span>
                    </button>
                    {isMenuOpen && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute right-0 mt-3 w-48 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-stone-100 py-2 z-50 overflow-hidden font-sans">
                        <Link href="/profile" className="block px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors">Profile</Link>
                        <Link href="/orders" className="block px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors">Orders</Link>
                        <hr className="border-stone-100 my-1" />
                        <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors">Logout</button>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-6">
                    <Link href="/login" className="relative text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 hover:text-white transition-all duration-300 group">Login <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-amber-200 transition-all duration-300 group-hover:w-full"></span></Link>
                    <Link href="/register" className="relative text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 hover:text-white transition-all duration-300 group">Register <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-amber-200 transition-all duration-300 group-hover:w-full"></span></Link>
                  </div>
                )}
              </div>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-white/90 hover:text-white focus:outline-none transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />) : (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />)}
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* HERO SECTION WITH PARALLAX */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden pt-20"
        >
          <motion.div
            style={{ y: heroBgY }}
            className="absolute inset-0 bg-gradient-to-b from-[#FBFBF9] via-stone-50 to-[#F5F5F0] opacity-80 scale-125 origin-top"
          />
          <motion.div
            style={{ y: heroTextY }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="relative z-10 text-center space-y-6 md:space-y-8 max-w-4xl"
          >
            <motion.p variants={fadeInUp} className="text-stone-400 tracking-[0.5em] uppercase text-xs font-semibold">The Artisan Fragrance House</motion.p>
            <motion.h1 variants={fadeInUp} className={`${fontJudul.className} text-6xl md:text-[120px] uppercase text-stone-900 drop-shadow-sm`}>EVOMI</motion.h1>
            <motion.p variants={fadeInUp} className="text-stone-500 italic max-w-xl mx-auto text-sm md:text-base">Kurasi aroma yang melampaui waktu.</motion.p>
            <motion.div variants={fadeInUp} className="flex justify-center pt-4">
              <Link href="/produk" className="group relative inline-flex items-center justify-center px-8 py-3.5 text-xs font-bold tracking-widest text-white uppercase bg-stone-900 rounded-full overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-0.5 transition-all duration-300">
                <span className="relative z-10 group-hover:text-amber-100 transition-colors duration-300">Explore Collection</span>
                <div className="absolute inset-0 h-full w-full bg-stone-800 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* ABOUT SECTION */}
        <motion.section
          id="about"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          className="relative py-24 md:py-32 px-6 md:px-8 max-w-7xl mx-auto z-20 bg-[#FBFBF9]"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start">
            <div className="md:col-span-5 text-center md:text-left">
              <h2 className={`${fontJudul.className} text-4xl md:text-5xl text-stone-900 leading-[1.1] uppercase`}>Crafting <br className="hidden md:block" /> Memories</h2>
              <div className="w-12 h-[2px] bg-amber-800/30 mt-6 mx-auto md:mx-0"></div>
            </div>
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-14 pt-2">
              <div className="space-y-4 group">
                <h3 className="font-bold text-stone-800 uppercase tracking-[0.2em] text-[10px] flex items-center gap-3">
                  <span className="w-4 h-[1px] bg-stone-300 group-hover:bg-amber-800 group-hover:w-8 transition-all duration-300"></span>
                  Pionir Wewangian
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed font-light">Evomi memadukan botani langka dengan teknik ekstraksi modern untuk menghasilkan karakter aroma unik yang mendalam.</p>
              </div>
              <div className="space-y-4 group">
                <h3 className="font-bold text-stone-800 uppercase tracking-[0.2em] text-[10px] flex items-center gap-3">
                  <span className="w-4 h-[1px] bg-stone-300 group-hover:bg-amber-800 group-hover:w-8 transition-all duration-300"></span>
                  Eksklusivitas
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed font-light">Setiap batch diproduksi dalam jumlah terbatas untuk menjamin kualitas dan kemurnian material organik tetap terjaga sempurna.</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* CAROUSEL POSTER */}
        {/* <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          className="relative py-10 md:py-20 px-6 md:px-16 z-20 bg-[#FBFBF9]"
        >
          <div className="max-w-7xl mx-auto">
            <ImageCarousel />
          </div>
        </motion.section> */}

        {/* PRODUCT GRID */}
        <section id="product" className="relative py-20 md:py-32 px-4 md:px-8 bg-white border-y border-stone-100 shadow-[0_0_50px_rgba(0,0,0,0.02)] z-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mb-16 md:mb-24 space-y-4"
            >
              <h2 className={`${fontJudul.className} text-3xl md:text-5xl uppercase tracking-tight text-stone-800`}>Signature Essence</h2>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-8 md:w-12 h-[1px] bg-stone-200"></div>
                <p className="text-stone-400 tracking-[0.25em] uppercase text-[9px] md:text-xs font-semibold">Featured Collection</p>
                <div className="w-8 md:w-12 h-[1px] bg-stone-200"></div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8"
            >
              {topFourProducts.map((parfum) => (
                <motion.div key={parfum.id} variants={fadeInUp} className="group flex flex-col h-full">
                  <div className="relative aspect-[4/5] overflow-hidden bg-stone-50 mb-5 rounded-2xl border border-stone-100 shadow-sm group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-all duration-500">
                    <Image src={parfum.image_url || "/img/placeholder.jpg"} alt={parfum.nama} fill unoptimized className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                    <Link href={`/produk/${parfum.id}`} className="absolute inset-0 z-10 opacity-0 md:group-hover:opacity-100 bg-stone-900/10 backdrop-blur-[2px] transition-all duration-500 flex items-end p-4">
                      <div className="w-full bg-white/95 backdrop-blur-md py-3.5 text-[10px] uppercase font-bold tracking-widest text-center text-stone-800 translate-y-4 group-hover:translate-y-0 transition-all duration-500 rounded-xl shadow-lg hover:bg-stone-900 hover:text-white">Discover</div>
                    </Link>
                  </div>
                  <div className="text-center space-y-2 px-2 flex-grow flex flex-col justify-end">
                    <span className="text-[8px] md:text-[10px] text-stone-400 uppercase tracking-[0.2em] font-medium">Unisex • {parfum.ukuran}</span>
                    <h3 className={`${fontJudul.className} text-base md:text-xl text-stone-800 uppercase leading-snug line-clamp-1 group-hover:text-amber-800 transition-colors`}>{parfum.nama}</h3>
                    <p className="text-stone-600 font-medium text-[11px] md:text-sm tracking-wide">Rp {Number(parfum.harga_retail).toLocaleString("id-ID")}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-16 text-center">
              <Link href="/produk" className="inline-block border-b border-stone-300 pb-1 text-xs uppercase tracking-widest font-bold text-stone-500 hover:text-stone-900 hover:border-stone-900 transition-all">View All Collection</Link>
            </motion.div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="relative py-20 md:py-28 bg-[#FBFBF9] px-6 text-center z-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12"
          >
            {[
              { title: "12H+", desc: "Projection" },
              { title: "Artisan", desc: "Batch" },
              { title: "Recycled", desc: "Glass" },
              { title: "Organic", desc: "Essence" },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="group">
                <div className={`${fontJudul.className} text-3xl md:text-4xl mb-2 text-stone-300 group-hover:text-stone-800 transition-colors duration-500`}>{item.title}</div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* TESTIMONIAL SECTION WITH PARALLAX */}
        <section
          ref={testimonialRef}
          className="relative py-24 md:py-32 bg-stone-950 text-white px-6 overflow-hidden z-20"
        >
          {/* Pastikan section ini 'relative' agar koordinat 'testimonialGlowY' dihitung dari sini */}
          <motion.div
            style={{ y: testimonialGlowY }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-stone-800/30 blur-[120px] rounded-full pointer-events-none"
          />
          <div className="max-w-6xl mx-auto text-center space-y-16 md:space-y-24 relative z-10">
            <motion.h2 initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className={`${fontJudul.className} text-3xl md:text-5xl italic leading-tight text-stone-100 font-light`}>
              "The scent of a woman, <br /> The presence of a soul."
            </motion.h2>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-left"
            >
              {[
                { name: "Clara S.", text: "Peaceful Calm adalah aroma paling segar yang pernah saya miliki. Menyatu sempurna dengan kulit." },
                { name: "Dimas R.", text: "Rabel Brave sangat memikat perhatian di malam hari. Projection-nya luar biasa tahan lama." },
                { name: "Sarah W.", text: "Packaging Evomi sangat mewah, benar-benar brand berkelas internasional dari lokal." },
              ].map((t, i) => (
                <motion.div key={i} variants={fadeInUp} className="bg-white/[0.03] backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:bg-white/[0.06] transition-colors duration-300 flex flex-col justify-between space-y-6">
                  <p className="text-stone-300 text-sm md:text-base font-light italic leading-relaxed">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-[10px] font-bold text-stone-400 uppercase">{t.name.charAt(0)}</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-100">{t.name}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FOOTER */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative z-20 bg-white pt-20 pb-10 px-6 md:px-8 border-t border-stone-100"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-12 mb-16">
            <div className="md:col-span-5">
              <h2 className={`${fontJudul.className} text-3xl mb-5 tracking-widest text-stone-900`}>EVOMI</h2>
              <p className="max-w-sm text-stone-500 text-sm font-light leading-relaxed">Menghadirkan pengalaman sensorik melalui kurasi aroma terbaik. Dedikasi pada seni artisan fragrance.</p>
            </div>
            <div className="md:col-span-3">
              <h4 className="font-bold text-[11px] uppercase tracking-widest mb-6 text-stone-800">Contact Us</h4>
              <ul className="text-stone-500 space-y-3 text-sm font-light">
                <li className="hover:text-stone-900 transition-colors cursor-pointer">hello@evomi.com</li>
                <li>Jakarta, Indonesia</li>
              </ul>
            </div>
            <div className="md:col-span-4">
              <h4 className="font-bold text-[11px] uppercase tracking-widest mb-6 text-stone-800">The Newsletter</h4>
              <p className="text-stone-400 text-xs mb-4">Dapatkan akses eksklusif ke rilis terbaru kami.</p>
              <div className="flex border-b border-stone-300 pb-2 focus-within:border-stone-900 transition-colors">
                <input type="email" placeholder="Your email address" className="bg-transparent w-full text-sm outline-none text-stone-800 placeholder-stone-400" />
                <button className="text-[10px] uppercase font-bold text-stone-800 hover:text-amber-800 transition-colors tracking-wider">Subscribe</button>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-around items-center text-center text-[10px] text-stone-400 uppercase tracking-[0.2em] pt-8 border-t border-stone-100 gap-4">
            
            {/* Year and Company Name */}
            <div>
              &copy; {mounted ? new Date().getFullYear() : "2026"} EVOMI FRAGRANCE HOUSE
            </div>

            <div className="flex space-x-6">

              {/* Instagram */}
              <SocialIcon
                url="https://instagram.com/evomi"
                network="instagram"
                fgColor="currentColor"
                bgColor="transparent"
                className="hover:text-stone-900 transition-colors"
                style={{ height: 25, width: 25 }} // Ukuran ikon disesuaikan agar proporsional dengan teks [10px]
              />

              {/* TikTok */}
              <SocialIcon
                url="https://tiktok.com/@evomi"
                network="tiktok"
                fgColor="currentColor"
                bgColor="transparent"
                className="hover:text-stone-900 transition-colors"
                style={{ height: 25, width: 25 }}
              />
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}