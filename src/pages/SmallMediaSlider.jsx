import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const SmallMediaSlider = ({ youtubeLinks = [] }) => {
  return (
    <section className=" py-10 text-white">
      <h2 className="text-3xl font-bold text-center mb-8">Highlights</h2>

      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        slidesPerView={1}
        loop={true}
        className="max-w-3xl mx-auto rounded-xl"
        style={{ height: "240px" }}
      >
        {youtubeLinks.map((url, i) => {
          const id = url.split("v=")[1]?.split("&")[0]; // extract ID
          return (
            <SwiperSlide key={i}>
              <a href={url} target="_blank" rel="noopener noreferrer">
                <img
                  src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`}
                  alt="YouTube Thumbnail"
                  className="w-full h-full object-cover rounded-xl"
                />
              </a>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};

export default SmallMediaSlider;
