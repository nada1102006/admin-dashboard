
import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import Products from '../../pages/Products';

// استقبلنا الـ images كـ prop هنا
export default function Slider({ images }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const mainSwiperRef = useRef(null);


  // The API returns image objects ({ url }), while local previews can be URL strings.
  // Normalize both shapes before passing values to the img `src` attribute.
  const imageList = (Array.isArray(images) ? images : [])
    .map((image) => (typeof image === 'string' ? image : image?.url))
    .filter(Boolean);

  if (!imageList.length) {
    return (
      <div className="flex h-80 items-center justify-center rounded-[28px] border border-slate-200 bg-slate-50 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        No images available
      </div>
    );
  }

  return (
    <div className="w-full">
      <Swiper
        loop={Products.length > 4}
        spaceBetween={10}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Autoplay, FreeMode, Thumbs]}
        className="mb-4 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        onSwiper={(swiper) => {
          mainSwiperRef.current = swiper;
        }}
      >
        {imageList.map((imageUrl, index) => (
          <SwiperSlide key={index}>
            <img
              src={imageUrl}
              alt={`Product ${index + 1}`}
              className="h-100 w-full rounded-[22px] object-contain cursor-pointer"
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
        className="thumbs-slider p-4"
      >
        {imageList.map((imageUrl, index) => (
          <SwiperSlide key={`thumb-${index}`} className="rounded-2xl bg-white shadow-sm dark:bg-slate-800">
            <img
              src={imageUrl}
              alt={`Thumbnail ${index + 1}`}
              className="h-37.5 w-full rounded-2xl object-cover cursor-pointer"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
