"use client";

// import module
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// TODO: Add discount logic here
const posters = [
  {
    id: 1,
    title: "Purpose Prestige",
    subtitle: "Prestige, Elegant",
    image: "http://127.0.0.1:8000/storage/new products/gemini - purpose prestige.png", // Ganti dengan path poster Anda
    color: "bg-stone-100",
  },
  {
    id: 2,
    title: "Peaceful Calm",
    subtitle: "Calm, Peaceful",
    image: "http://127.0.0.1:8000/storage/new products/gemini - peaceful calm.png",
    color: "bg-stone-200",
  },
  {
    id: 3,
    title: "Sweet Shy",
    subtitle: "Shy, Sweet",
    image: "http://127.0.0.1:8000/storage/new products/gemini - sweet shy.png",
    color: "bg-stone-100",
  },
  {
    id: 4,
    title: "Rabel Brave",
    subtitle: "Be Brave, Be You",
    image: "http://127.0.0.1:8000/storage/new products/gemini - rabel brave.png",
    color: "bg-stone-100",
  },
];

// image carousel component
export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % posters.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + posters.length) % posters.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[310px] md:h-[580] overflow-hidden rounded-3xl group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative w-full h-full"
        >
          {/* Overlay Konten */}
          <div className="absolute inset-0 z-10 flex flex-col justify-center px-12 md:px-20 bg-gradient-to-r from-black/95 to-black/1 text-white">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-[10px] uppercase tracking-[0.4em] font-bold mb-2 text-amber-200"
            >
              {posters[currentIndex].subtitle}
            </motion.p>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-4xl md:text-6xl font-brand uppercase tracking-tighter"
            >
              {posters[currentIndex].title}
            </motion.h3>
          </div>

          <Image
            src={posters[currentIndex].image}
            alt={posters[currentIndex].title}
            fill
            className="object-contain rounded-xl" // Ini kuncinya: gambar mengecil agar pas di dalam div
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigasi Bullets */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {posters.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1 transition-all duration-500 rounded-full ${
              idx === currentIndex ? "w-8 bg-white" : "w-2 bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* Tombol Panah (Opsional) */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-white/70 hover:text-white"
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-white/70 hover:text-white"
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
