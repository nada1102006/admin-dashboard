import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import { useProduct } from '../Context/ProductContext';

export default function Slider() {
  const { product } = useProduct();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const mainSwiperRef = useRef(null);
  const images = product?.images || [];

  if (!images.length) {
    return (
      <div className="flex h-[320px] items-center justify-center rounded-[28px] border border-slate-200 bg-slate-50 text-sm text-slate-500">
        No images available
      </div>
    );
  }

  return (
    <div className="">
      <Swiper
        loop={true}
        spaceBetween={10}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Autoplay, FreeMode, Thumbs]}
        className="mb-4 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm"
        onSwiper={(swiper) => {
          mainSwiperRef.current = swiper;
        }}
      >
        {images.map((image, index) => (
          <SwiperSlide key={image?.public_id || `${image?.url}-${index}`}>
            <img
              src={image?.url}
              alt={`Product ${index + 1}`}
              className="h-[400px]  w-full rounded-[22px] object-contain cursor-pointer"
              onClick={() => {
                mainSwiperRef.current?.slideTo(index);
                thumbsSwiper?.slideTo(index);
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        onSwiper={(swiper) => {
          setThumbsSwiper(swiper);
        }}
        loop={true}
        spaceBetween={20}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Thumbs]}
        className="thumbs-slider p-4  "
      >
        {images.map((image, index) => (
          <SwiperSlide key={`${image?.public_id || image?.url}-${index}`} className="bg-white  shadow-sm rounded-[16px]">
            <img
              src={image?.url}
              alt={`Thumbnail ${index + 1}`}
              className=" h-[150px] rounded-[16px] object-contain cursor-pointer "
              onClick={() => {
                mainSwiperRef.current?.slideTo(index);
                thumbsSwiper?.slideTo(index);
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}