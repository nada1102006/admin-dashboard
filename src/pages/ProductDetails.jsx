// ProductDetails.jsx
import { useProduct } from "../Context/ProductContext";
import Slider from "../Components/ProductDetails/Slider";
import ProductOverview from "../Components/ProductDetails/ProductOverview";
import ProductNotFound from "../Components/ProductDetails/ProductNotFound";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { FiPackage, FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import { ProductDetailsSkeleton } from "../components/Skeleton/ProductDetailsSkeleton/ProductDetailsSkeleton";
import useTheme from "../components/customHook/useTheme";

export default function ProductDetails() {
  const { id } = useParams();
  const { isDarkMode } = useTheme();

  const { product, loading, error, fetchProductById } = useProduct();

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id, fetchProductById]);

  // Skeleton loading state
  if (loading) {
    const skeletonBaseColor = isDarkMode ? "#1e293b" : "#e2e8f0";
    const skeletonHighlightColor = isDarkMode ? "#334155" : "#f1f5f9";

    return (
      <ProductDetailsSkeleton
        baseColor={skeletonBaseColor}
        highlightColor={skeletonHighlightColor}
      />
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/50 p-6 dark:bg-slate-900">
        <div className="rounded-3xl border border-rose-200/50 dark:border-rose-800/50 bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-950/30 dark:to-rose-950/20 p-8 text-center shadow-lg backdrop-blur-sm">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-red-500 text-white shadow-lg shadow-rose-500/30">
              <FiPackage size={32} />
            </div>
          </div>
          <h3 className="text-xl font-bold text-rose-700 dark:text-rose-400 mb-2">Product Not Found</h3>
          <p className="text-sm text-rose-600 dark:text-rose-400/80">{error}</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-semibold hover:from-cyan-600 hover:to-sky-600 transition-all shadow-lg shadow-cyan-500/30"
          >
            <FiArrowLeft size={16} />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return <ProductNotFound />;
  }

  const imageUrls = Array.isArray(product.images)
    ? product.images
        .map((image) => (typeof image === "string" ? image : image?.url))
        .filter(Boolean)
    : [];

  return (
    <section className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8 text-slate-900 dark:bg-slate-900 dark:text-slate-200">
      <div className="mx-auto max-w-[1600px] slide-up">
        
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 p-6 shadow-lg transition-all duration-300 hover:shadow-xl mb-8">
          <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-500/5"></div>
          <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-500/5"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-500 text-white shadow-lg shadow-cyan-500/30">
                  <FiPackage size={22} />
                </div>
                <div>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-cyan-500 transition-colors dark:text-slate-400 dark:hover:text-cyan-400"
                  >
                    <FiArrowLeft size={16} />
                    Back to Products
                  </Link>
                  <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                    {product?.name || "Product Details"}
                  </h1>
                </div>
              </div>
              <span className="rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 backdrop-blur-sm">
                Product details overview
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:gap-10 xl:grid-cols-[1fr_1.1fr]">
          
          <div className="rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 p-4 shadow-lg transition-all duration-300 hover:shadow-xl overflow-hidden">
            <Slider images={imageUrls} />
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
              <ProductOverview product={product} />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}