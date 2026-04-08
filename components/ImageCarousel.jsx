"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
// Jika menggunakan icon dari lucide-react atau heroicons, bisa di-import di sini.
// Untuk contoh ini kita gunakan karakter teks sederhana agar tidak perlu install dependensi.

const carouselImages = [
  {
    id: 1,
    src: "/img/poster/Artboard 1.jpeg",
    alt: "Evomi Collection 1",
  },
  {
    id: 2,
    src: "/img/poster/Artboard 2.jpeg", // Pastikan file ini ada
    alt: "Evomi Collection 2",
  },
  {
    id: 3,
    src: "/img/poster/Artboard 3.jpeg", // Pastikan file ini ada
    alt: "Evomi Collection 3",
  },
  {
    id: 4,
    src: "/img/poster/Artboard 4.jpeg", // Pastikan file ini ada
    alt: "Evomi Collection 4",
  },
  {
    id: 5,
    src: "/img/poster/Artboard 5.jpeg", // Pastikan file ini ada
    alt: "Evomi Collection 5",
  },
];

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000); // Ganti gambar setiap 5 detik
    return () => clearInterval(timer);
  }, [currentIndex]);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide
      ? carouselImages.length - 1
      : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === carouselImages.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className="relative w-full h-[500px] md:h-[600px] group overflow-hidden bg-stone-100 rounded-2xl">
      {/* Image Container */}
      <div
        className="w-full h-full flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {/* carousel images */}
        {carouselImages.map((image) => (
          <div key={image.id} className="min-w-full h-full relative">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-contain"
              priority={image.id === 1}
            />
            {/* Optional Overlay */}
            <div className="absolute inset-0 bg-black/2"></div>
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="hidden group-hover:block absolute top-[50%] -translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/30 text-white cursor-pointer hover:bg-black/50 transition"
        aria-label="Previous Slide"
      >
        &#10094;
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="hidden group-hover:block absolute top-[50%] -translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/30 text-white cursor-pointer hover:bg-black/50 transition"
        aria-label="Next Slide"
      >
        &#10095;
      </button>

      {/* Dots Indicators */}
      <div className="absolute bottom-6 flex justify-center w-full gap-2 px-4">
        {carouselImages.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`transition-all duration-300 w-2.5 h-2.5 rounded-full ${
              currentIndex === slideIndex
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${slideIndex + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
}
