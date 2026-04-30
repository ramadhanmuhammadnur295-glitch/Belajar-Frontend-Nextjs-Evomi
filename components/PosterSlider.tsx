"use client";

// import module
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Image from 'next/image';

// poster data
const posters = [
  { id: 1, src: '/images/poster1.jpg', alt: 'Promo Spesial 1' },
  { id: 2, src: '/images/poster2.jpg', alt: 'Koleksi Terbaru' },
  { id: 3, src: '/images/poster3.jpg', alt: 'Diskon Musim Ini' },
];

// poster slider component
const PosterSlider = () => {
  return (
    <section className="w-full py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <Swiper
          spaceBetween={20}
          centeredSlides={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="rounded-2xl overflow-hidden shadow-lg border border-gray-100"
        >
          {posters.map((poster) => (
            <SwiperSlide key={poster.id}>
              <div className="relative aspect-[16/9] md:aspect-[21/9] w-full">
                <Image
                  src={poster.src}
                  alt={poster.alt}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Overlay tipis untuk estetika */}
                <div className="absolute inset-0 bg-black/5" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .swiper-button-next, .swiper-button-prev {
          color: #000;
          background: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(8px);
          width: 45px;
          height: 45px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .swiper-button-next:after, .swiper-button-prev:after {
          font-size: 18px;
          font-weight: bold;
        }
        .swiper-pagination-bullet-active {
          background: #000 !important;
        }
      `}</style>
    </section>
  );
};

export default PosterSlider;