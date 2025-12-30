import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { iframe } from "framer-motion/client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const SmallMediaSlider = ({ youtubeLinks = [] , googledrive = []}) => {
  return (
    <section className=" py-10 text-white">
      <h2 className="text-5xl font-bold text-center mt-10 mb-8">Our Achievements</h2>

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

        {googledrive.map((url,i) => {
          const id = url.split("d/")[1]?.split("/")[0];
          return (
            <>
            <SwiperSlide key = {i}>            
            <img src = {`https://drive.google.com/file/d/${id}/preview`} alt = "Thumbnail Image" className = "w-100 h-400" ></img>

            </SwiperSlide>

            </>
          )
        })}
      </Swiper>
    </section>
  );
};

export default SmallMediaSlider;
