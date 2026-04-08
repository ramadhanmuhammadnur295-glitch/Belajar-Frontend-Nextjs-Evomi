import React from "react";
import Head from "next/head";
import Image from 'next/image';
import Link from 'next/link';
import evomiData from '../data/evomi.json';
import ImageCarousel from '@/components/ImageCarousel';
import localFont from 'next/font/local';

// Inisialisasi Font
const fontJudul = localFont({
  src: "./fonts/8 Heavy.ttf",
  variable: "--font-brand",
  display: 'swap',
});

const fontCaption = localFont({
  src: "./fonts/Nohemi-Regular.otf",
  variable: "--font-body",
  display: 'swap',
});

export default function EvomiLandingPage() {
  const topFourProducts = evomiData.kategori_produk.slice(0, 4);

  return (
    <div className={`${fontCaption.variable} ${fontJudul.variable} selection:bg-amber-100`}>
      <Head>
        <title>Evomi Fragrance | Redefining Presence</title>
        <meta name="description" content="Artisan perfume house based in Jakarta" />
      </Head>

      <div className="min-h-screen bg-[#FBFBF9] text-stone-900 font-sans antialiased">

        {/* NAVBAR - Dibuat lebih tipis & minimalis */}
        <nav className="fixed w-full z-50 bg-white/70 backdrop-blur-xl border-b border-stone-100">
          <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
            <Link href="/" className="hover:opacity-70 transition-opacity">
              <Image
                src="/img/Logo Evomi.png"
                alt="Evomi Logo"
                width={100}
                height={40}
                className="brightness-0"
              />
            </Link>

            <div className={`hidden md:flex items-center space-x-12 ${fontJudul.className} text-[14px] tracking-[0.2em] uppercase`}>
              <a href="#about" className="hover:text-amber-800 transition-colors">About</a>
              <a href="#product" className="hover:text-amber-800 transition-colors">Collection</a>
              <a href="#why" className="hover:text-amber-800 transition-colors">Why</a>
              <Link href="/produk" className="bg-stone-900 text-white px-6 py-2 hover:bg-amber-900 transition-all rounded-full">
                Shop
              </Link>
            </div>
          </div>
        </nav>

        {/* HERO SECTION - Teks dibuat lebih proporsional */}
        <section className="relative h-screen flex items-center justify-center text-center px-6 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/img/poster/Artboard 2.jpeg"
              alt="Background"
              fill
              className="object-contain scale-100"
              priority
            />
            <div className="absolute inset-0 bg-stone-900/70 backdrop-brightness-90"></div>
          </div>

          <div className="relative z-10 text-white space-y-8">
            <span className={`${fontCaption.className} uppercase tracking-[0.5em] text-xs md:text-sm animate-fade-in`}>
              The Artisan Fragrance House
            </span>
            <h1 className={`${fontJudul.className} text-7xl md:text-9xl tracking-tighter`}>
              EVOMI
            </h1>
            <p className={`${fontCaption.className} max-w-xl mx-auto text-lg md:text-xl font-light opacity-90 leading-relaxed tracking-wide`}>
              "Aroma yang mendefinisikan identitas, <br />esensi kemewahan dalam setiap tetes."
            </p>
            <div className="pt-8">
              <Link href="/produk" className="group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden border border-white transition-all hover:bg-white">
                <span className="relative z-10 text-white group-hover:text-stone-900 uppercase tracking-widest text-xs font-bold transition-colors">
                  Explore Collection
                </span>
              </Link>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
            <div className="w-[1px] h-12 bg-white"></div>
          </div>
        </section>

        {/* ABOUT SECTION - Dibuat lebih "Editorial" */}
        <section id="about" className="py-32 px-8 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-16 items-center">
            <div className="md:col-span-4">
              <h2 className={`${fontJudul.className} text-4xl text-stone-400 leading-tight uppercase`}>
                Crafting <br /> Memories
              </h2>
            </div>
            <div className="md:col-span-8 grid md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h3 className="font-bold text-amber-900 uppercase tracking-widest text-xs">Pionir Wewangian</h3>
                <p className="text-stone-600 leading-relaxed font-light">
                  Evomi memadukan botani langka dengan teknik ekstraksi modern untuk menciptakan karakter aroma yang tidak ditemukan di tempat lain.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-amber-900 uppercase tracking-widest text-xs">Eksklusivitas</h3>
                <p className="text-stone-600 leading-relaxed font-light">
                  Setiap batch diproduksi secara terbatas untuk menjamin kualitas material organik tetap terjaga hingga ke tangan Anda.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CAMPAIGN - Full Width biar dramatis */}
        <section className="bg-stone-50 py-20">
          <div className="max-w-screen-2xl mx-auto px-4">
            <ImageCarousel />
          </div>
        </section>

        {/* PRODUCT SECTION - Card diredesain agar lebih bersih */}
        <section id="product" className="py-32 px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-20">
              <div>
                <h2 className={`${fontJudul.className} text-5xl uppercase tracking-tighter text-stone-800`}>The Edit</h2>
                <p className="text-stone-400 mt-2 tracking-[0.2em] uppercase text-xs">Featured Collection</p>
              </div>
              <Link href="/produk" className="text-stone-400 hover:text-stone-900 transition-colors uppercase text-xs tracking-widest border-b border-stone-200 pb-1">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {topFourProducts.map((parfum) => (
                <div key={parfum.id} className="group cursor-pointer">
                  {/* Image Wrapper */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-6">
                    <Image
                      src={`/img/produk/${parfum.image}.jpeg`}
                      alt={parfum.nama}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>

                    {/* Hover Button Quick View */}
                    <div className="absolute bottom-4 left-4 right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <Link href={`/produk/${parfum.id}`} className="block w-full bg-white/90 backdrop-blur text-center py-3 text-[10px] uppercase font-bold tracking-widest text-stone-900">
                        Lihat Detail
                      </Link>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-2 text-center">
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest">{parfum.gender}</span>
                    <h3 className={`${fontJudul.className} text-xl text-stone-800`}>{parfum.nama}</h3>
                    <p className="text-stone-500 text-sm font-light italic">
                      {parfum.karakter.slice(0, 2).join(" • ")}
                    </p>
                    <p className="text-stone-900 font-medium pt-2">
                      Rp {parfum.harga.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US - Minimalist Icons */}
        <section id="why" className="py-32 bg-stone-50 px-8 text-center">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { title: "12H+", desc: "Projection" },
              { title: "Artisan", desc: "Batch" },
              { title: "Recycled", desc: "Glass" },
              { title: "Organic", desc: "Essence" },
            ].map((item, i) => (
              <div key={i} className="group">
                <div className={`${fontJudul.className} text-3xl mb-2 text-stone-300 group-hover:text-amber-800 transition-colors`}>{item.title}</div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIAL - Dark & Bold */}
        <section className="py-32 bg-stone-900 text-white px-8">
          <div className="max-w-5xl mx-auto text-center space-y-16">
            <div className="space-y-4">
              <div className="w-12 h-[1px] bg-amber-500 mx-auto"></div>
              <h2 className={`${fontJudul.className} text-3xl md:text-5xl italic font-serif leading-tight text-stone-200`}>
                "The scent of a woman, <br /> The presence of a soul."
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-16">
              {[{ name: "Clara S.", text: "Velvet Night adalah aroma paling elegan yang pernah saya miliki." },
              { name: "Dimas R.", text: "Kesegaran Oceanic Mist tidak tertandingi. Tahan lama seharian." },
              { name: "Sarah W.", text: "Packaging Evomi sangat mewah, benar-benar brand berkelas." }
              ].map((t, i) => (
                <div key={i} className="space-y-6 group">
                  <p className="text-stone-400 font-light leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">"{t.text}"</p>
                  <div className="text-[10px] uppercase tracking-[0.4em] font-bold text-amber-500">— {t.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-white pt-24 pb-12 px-8 border-t border-stone-100">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
              <h2 className={`${fontJudul.className} text-3xl mb-6 tracking-widest`}>EVOMI</h2>
              <p className="max-w-xs text-stone-400 font-light leading-relaxed">
                Menghadirkan pengalaman sensorik melalui kurasi aroma terbaik. Bergabunglah dengan perjalanan kami.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-6">Contact</h4>
              <ul className="text-stone-500 space-y-3 text-sm font-light">
                <li>hello@evomi.com</li>
                <li>Jakarta, Indonesia</li>
                <li className="pt-4 flex space-x-4">
                  <a href="#" className="hover:text-stone-900">IG</a>
                  <a href="#" className="hover:text-stone-900">TW</a>
                  <a href="#" className="hover:text-stone-900">TK</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-6">Newsletter</h4>
              <div className="flex border-b border-stone-200 pb-2">
                <input type="email" placeholder="Email address" className="bg-transparent w-full text-sm outline-none" />
                <button className="text-[10px] uppercase tracking-widest font-bold">Join</button>
              </div>
            </div>
          </div>
          <div className="text-center text-[10px] text-stone-300 uppercase tracking-[0.5em] pt-12 border-t border-stone-50">
            &copy; {new Date().getFullYear()} EVOMI FRAGRANCE HOUSE
          </div>
        </footer>

      </div>
    </div>
  );
}