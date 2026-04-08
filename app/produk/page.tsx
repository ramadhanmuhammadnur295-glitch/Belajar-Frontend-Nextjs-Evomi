import React from "react";
import Head from "next/head";
import Image from 'next/image';
import Link from 'next/link';
import localFont from 'next/font/local';
import evomiData from '../../data/evomi.json';

// --- Font Configuration ---
const fontJudul = localFont({
  src: "./../fonts/8 Heavy.ttf",
  variable: "--font-brand",
  display: 'swap',
});

const fontCaption = localFont({
  src: "./../fonts/Nohemi-Regular.otf",
  variable: "--font-body",
  display: 'swap',
});

// --- Sub-Component: Product Card ---
const ProductCard = ({ parfum }) => {
  return (
    <div className="group flex flex-col bg-white border border-stone-100 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-500">
      {/* Image Area */}
      <div className="relative w-full h-72 overflow-hidden bg-stone-100">
        <Image
          src={`/img/produk/${parfum.image}.jpeg`}
          alt={parfum.nama}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4">
          <span className="bg-white/90 backdrop-blur-sm text-stone-600 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-medium shadow-sm">
            {parfum.gender}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-stone-900 mb-1 group-hover:text-amber-800 transition-colors">
            {parfum.nama}
          </h3>
          <p className="text-xs text-stone-400 uppercase tracking-tighter">
            {parfum.konsentrasi} • {parfum.ukuran}
          </p>
        </div>

        {/* Character Badges */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {parfum.karakter.map((char, index) => (
            <span key={index} className="text-[10px] bg-stone-50 text-stone-500 border border-stone-200 px-2 py-0.5 rounded">
              {char}
            </span>
          ))}
        </div>

        {/* Fragrance Notes Snippet */}
        <div className="mb-6 space-y-1 border-l-2 border-amber-100 pl-3">
          <p className="text-[11px] text-stone-500 leading-relaxed">
            <span className="font-semibold text-stone-700">Top:</span> {parfum.notes.top_notes.slice(0, 2).join(', ')}...
          </p>
        </div>

        {/* Price & Action */}
        <div className="mt-auto pt-4 border-t border-stone-50 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-stone-400 uppercase">Investment</p>
            <p className="text-lg font-bold text-stone-900">
              Rp {parfum.harga.toLocaleString('id-ID')}
            </p>
          </div>
          <Link
            href={`/produk/${parfum.id}`}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-stone-900 text-white hover:bg-amber-800 transition-colors shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---
export default function Products() {
  const topFourProducts = evomiData.kategori_produk.slice(0, 4);

  return (
    <div className={`${fontJudul.variable} ${fontCaption.variable} font-body selection:bg-amber-100`}>
      <Head>
        <title>Our Collections | EVOMI Fragrance</title>
        <meta name="description" content="Explore the signature scents of Evomi. Redefining presence through scent." />
      </Head>

      <div className="min-h-screen bg-[#FDFCFB] text-stone-900">
        
        {/* NAVBAR */}
        <nav className="fixed w-full z-50 bg-white/70 backdrop-blur-lg border-b border-stone-100">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="hover:opacity-70 transition-opacity">
              <Image 
                src="/img/Logo Evomi.png" 
                alt="Evomi Logo" 
                width={100} 
                height={40} 
                className="brightness-0" 
              />
            </Link>
            <div className="hidden md:flex space-x-8 text-[11px] uppercase tracking-[0.2em] font-medium">
              <Link href="/" className="hover:text-amber-700">Home</Link>
              <Link href="#product" className="text-amber-800">Collections</Link>
              <Link href="#footer" className="hover:text-amber-700">Contact</Link>
            </div>
          </div>
        </nav>

        {/* PRODUCT SECTION */}
        <section id="product" className="pt-32 pb-24 px-6">
          <div className="max-w-7xl mx-auto">
            <header className="max-w-2xl mx-auto text-center mb-20">
              <h2 className="font-brand text-stone-400 text-sm uppercase tracking-[0.4em] mb-4">
                Curated Scents
              </h2>
              <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6">
                Our Collections
              </h1>
              <div className="h-px w-20 bg-amber-200 mx-auto"></div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {topFourProducts.map((parfum) => (
                <ProductCard key={parfum.id} parfum={parfum} />
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer id="footer" className="bg-stone-900 text-stone-300 py-20 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <h2 className="font-brand text-white text-3xl mb-6 tracking-[0.2em]">EVOMI</h2>
              <p className="max-w-sm text-stone-400 leading-relaxed italic">
                &quot;Redefining Presence through Scent.&quot; Kami percaya bahwa parfum adalah identitas yang tidak terlihat namun paling berkesan.
              </p>
            </div>

            <div>
              <h4 className="text-white text-xs uppercase tracking-widest mb-6 font-bold">Contact</h4>
              <ul className="space-y-4 text-sm text-stone-400">
                <li>Jakarta, Indonesia</li>
                <li>hello@evomi.com</li>
                <li>+62 812 3456 789</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-xs uppercase tracking-widest mb-6 font-bold">Socials</h4>
              <div className="flex flex-col space-y-4 text-sm">
                <a href="#" className="hover:text-white transition-colors">Instagram</a>
                <a href="#" className="hover:text-white transition-colors">TikTok</a>
                <a href="#" className="hover:text-white transition-colors">Twitter</a>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-stone-500">
            <p>&copy; {new Date().getFullYear()} EVOMI FRAGRANCE. ALL RIGHTS RESERVED.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}