import { FaBox, FaStar, FaTag } from 'react-icons/fa';
import { useProduct } from '../Context/ProductContext';

export default function ProductOveriew() {
  const { product, loading, error } = useProduct();

  if (loading) {
    return <div className="rounded-[24px] bg-white p-8 text-slate-500 shadow-sm">Loading product...</div>;
  }

  if (error) {
    return <div className="rounded-[24px] bg-red-50 p-8 text-red-600 shadow-sm">{error}</div>;
  }

  if (!product) {
    return null;
  }

  const price = Number(product.price || 0);
  const discountPrice = Number(product.discountPrice || 0);
  const hasDiscount = discountPrice > 0 && discountPrice < price;
  const formattedPrice = new Intl.NumberFormat('en-US').format(price);
  const formattedDiscount = new Intl.NumberFormat('en-US').format(discountPrice);

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Product Overview</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">{product.name}</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
          {product.category} / {product.subcategory}
        </span>
      </div>

      <p className="mt-5 text-base leading-7 text-slate-600">{product.description}</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="rounded-2xl bg-slate-900 px-4 py-2 text-white">
          {hasDiscount ? `${formattedDiscount} EGP` : `${formattedPrice} EGP`}
        </div>
        {hasDiscount && (
          <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600">
            Save {formattedPrice - formattedDiscount} EGP
          </div>
        )}
        {price > 0 && hasDiscount && (
          <span className="text-sm text-slate-400 line-through">{formattedPrice} EGP</span>
        )}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-600">
            <FaTag />
            <span className="text-sm font-semibold">Brand</span>
          </div>
          <p className="mt-2 text-lg font-semibold text-slate-900">{product.brand}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-600">
            <FaBox />
            <span className="text-sm font-semibold">Stock</span>
          </div>
          <p className="mt-2 text-lg font-semibold text-slate-900">{product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-600">
            <FaStar />
            <span className="text-sm font-semibold">Rating</span>
          </div>
          <p className="mt-2 text-lg font-semibold text-slate-900">{product.averageRating || 0} / 5</p>
        </div>
      </div>

      <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-semibold text-slate-900">Short Description</h3>
        <p className="mt-2 text-sm leading-7 text-slate-600">{product.shortDescription}</p>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-slate-900">Reviews</h3>
        <div className="mt-4 space-y-3">
          {(product.reviews || []).slice(0, 3).map((review) => (
            <div key={review._id} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-slate-900">{review.username}</p>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-600">
                  {review.rating} / 5
                </span>
              </div>
              <p className="mt-2 text-sm leading-7 text-slate-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}