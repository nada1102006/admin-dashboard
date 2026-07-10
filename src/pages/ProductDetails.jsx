import { useProduct } from "../Context/ProductContext";
import Slider from "../Components/Slider";
import ProductOverview from "../Components/ProductOverview";
import ProductNotFound from "../Components/ProductNotFound";
import HeaderPadge from "../Components/HeaderPadge";
import { useParams } from "react-router-dom";
import { useEffect } from "react";


export default function ProductDetails() {
  const { id } = useParams();

  const { product, loading, fetchProductById } = useProduct();


  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id, fetchProductById]);

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600">

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

  return (
    <section className="min-h-screen  p-6 lg:p-8">
      <div className="  mx-auto flex flex-col gap-8 ">

        {/* Header */}
        <div className="">

       <HeaderPadge productName={product?.name}/>
        </div>

        {/* Main Content */}
        <div className=" grid gap-8 grid-cols-12">

          {/* Product Images */}
          <div className="col-span-12 md:col-span-6">
            <Slider images={product?.images || []} />
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