// components/AchievementSlider.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function AchievementSlider({ images = [] }) {
  return (
    <div className="w-[95%] mx-auto my-10">
      <h2 className="text-4xl font-bold text-center mb-8 text-white">
        Our Achievements
      </h2>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 2500 }}
        loop={true}
        spaceBetween={10}
        slidesPerView={1}   // ⬅ Only 1 image at a time
        className="mySwiper"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="rounded-xl overflow-hidden shadow-lg border border-gray-700 h-[350px] flex justify-center items-center ">
              <img 
                src={img}
                alt={`Achievement-${index}`}
                className="w-full h-full object-contain bg-black"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
