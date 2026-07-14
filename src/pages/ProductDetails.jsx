import { useProduct } from "../Context/ProductContext";
import Slider from "../Components/ProductDetails/Slider";
import ProductOverview from "../Components/ProductDetails/ProductOverview";
import ProductNotFound from "../Components/ProductDetails/ProductNotFound";
import HeaderPadge from "../Components/ProductDetails/HeaderPadge";
import { useParams } from "react-router-dom";
import { useEffect } from "react";











export default function ProductDetails() {
  const { id } = useParams();

  const { product, loading, error, fetchProductById } = useProduct();


  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id, fetchProductById]);

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600 dark:border-slate-700 dark:border-t-cyan-400">

        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6 dark:bg-slate-950">
        <div className="rounded-3xl bg-red-50 p-8 text-center text-red-700 shadow-sm dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      </div>
    );
  }

  // Product Not Found
  if (!product) {
    return (

      <ProductNotFound/>
     
    );
  }

  // Convert API image objects to URL strings before passing them to Swiper.
  const imageUrls = Array.isArray(product.images)
    ? product.images
        .map((image) => (typeof image === "string" ? image : image?.url))
        .filter(Boolean)
    : [];

  return (
    <section className="min-h-screen bg-slate-100 p-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100 lg:p-8">
      <div className="  mx-auto flex flex-col gap-8 ">

        {/* Header */}
        <div className="">

       <HeaderPadge productName={product?.name}/>
        </div>

        {/* Main Content */}
        <div className=" grid gap-8 grid-cols-12">

          {/* Product Images */}
          <div className="col-span-12 md:col-span-6">
            <Slider images={imageUrls} />
          </div>

          {/* Product Information */}
          <div className="space-y-6 col-span-12 md:col-span-6">
            <ProductOverview product={product} />
          </div>

        </div>

      </div>
    </section>
  );
}
