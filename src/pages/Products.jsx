import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FiPackage, FiPlus, FiSearch, FiSliders, FiEye, 
  FiEdit2, FiTrash2, FiStar, FiTrendingUp, FiBox, 
  FiLayers, FiTag, FiChevronLeft, FiChevronRight 
} from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "../api/api";

const categories = ["Electronics", "Phones", "Fashion", "Home", "Beauty", "Sports"];
export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({ search: "", category: "", subcategory: "" });
  const [appliedFilters, setAppliedFilters] = useState({ search: "", category: "", subcategory: "" });

  const [deletingId, setDeletingId] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const stats = useMemo(() => {
    const featured = products.filter(p => p.featured).length;
    const inStock = products.filter(p => Number(p.stock) > 0).length;
    return {
      total: totalProducts || products.length,
      featured,
      inStock,
      outOfStock: products.filter(p => Number(p.stock) <= 0).length,
    };
  }, [products, totalProducts]);

  useEffect(() => {
    const controller = new AbortController();
    async function loadProducts() {
      setLoading(true);
      setError("");
      try {
        const params = {
          page,
          limit: 12,
          ...(appliedFilters.search && { search: appliedFilters.search }),
          ...(appliedFilters.category && { category: appliedFilters.category }),
          ...(appliedFilters.subcategory && { subcategory: appliedFilters.subcategory }),
        };
        const endpoint = appliedFilters.subcategory ? "/products/search" : "/products";
        const { data } = await api.get(endpoint, { params, signal: controller.signal });
        setProducts(Array.isArray(data.products) ? data.products : []);
        setTotalProducts(Number(data.totalProducts) || 0);
        setTotalPages(Number(data.totalPages) || 1);
      } catch (err) {
        if (err.name !== "CanceledError") {
          setProducts([]);
          setError(err?.response?.data?.message || "Failed to load products.");
        }
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
    return () => controller.abort();
  }, [appliedFilters, page, refreshKey]);

  const updateFilter = (field, value) => setFilters(prev => ({ ...prev, [field]: value }));
  const applyFilters = () => { setPage(1); setAppliedFilters({ ...filters, search: filters.search.trim() }); };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    // Optimistically update the UI
    const previousProducts = [...products];
    setProducts(products.filter(p => p._id !== id));
    
    try {
      setDeletingId(id);
      await api.delete(`/products/${id}`);
      toast.success("Product deleted successfully");
      setRefreshKey(k => k + 1);
    } catch (err) {
      // Revert if API fails
      setProducts(previousProducts);
      toast.error(err?.response?.data?.message || "Failed to delete product. Please check your permissions.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 text-slate-900 bg-slate-50/50">
      <div className="mx-auto max-w-[1600px] space-y-6 lg:space-y-8">
        
        {/* Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-[28px] bg-linear-to-r from-[#fafdfd] via-[#f2fbfe] to-[#e0f7fc] shadow-[0_2px_20px_rgba(0,0,0,0.02)] gap-4 border border-[#e0f7fc]/50">
          <div className="flex items-center gap-5">
            <div className="w-15 h-15 shrink-0 flex items-center justify-center bg-[#ccf0f6] rounded-[20px]">
              <FiPackage className="w-7 h-7 text-[#008ba0]" strokeWidth={2} />
            </div>
            <div className="flex flex-col justify-center pt-1">
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#20a1b6] uppercase mb-1">
                Product Dashboard
              </span>
              <h1 className="text-[32px] leading-none font-black text-[#121926] tracking-tight">
                Products
              </h1>
            </div>
          </div>
          <button onClick={() => navigate("/add-product")} className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#00bad5] hover:bg-[#00a3bb] active:scale-95 text-white text-[15px] font-semibold rounded-2xl transition-all shadow-[0_4px_14px_0_rgba(0,186,213,0.3)]">
            <FiPlus className="w-5 h-5 stroke-[2.5]" />
            Add Product
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <StatCard icon={<FiBox />} value={stats.total} label="Total" tone="cyan" />
          <StatCard icon={<FiStar />} value={stats.featured} label="Featured" tone="amber" />
          <StatCard icon={<FiTrendingUp />} value={stats.inStock} label="In Stock" tone="emerald" />
          <StatCard icon={<FiPackage />} value={stats.outOfStock} label="Out of Stock" tone="rose" />
        </div>

        {/* Search & Filters */}
        <div className="rounded-[28px] bg-white p-5 lg:p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] border border-slate-100">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1 group">
              <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00bad5] w-5 h-5 transition-colors" />
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                className="h-13 w-full rounded-2xl border border-slate-200 bg-[#fafdfd] pl-12 pr-4 text-[15px] text-[#121926] outline-none transition-all focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] placeholder:text-slate-400"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`flex h-13 items-center justify-center gap-2 rounded-2xl border px-6 text-[15px] font-semibold transition-colors ${
                  filtersOpen 
                    ? "border-[#00bad5] bg-[#e0f7fc] text-[#008ba0]" 
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <FiSliders className="w-4 h-4" />
                Filters
              </button>
              <button 
                onClick={applyFilters}
                className="flex h-13 items-center justify-center gap-2 rounded-2xl bg-[#00bad5] hover:bg-[#00a3bb] px-8 text-[15px] font-semibold text-white transition-all shadow-[0_4px_14px_0_rgba(0,186,213,0.2)]"
              >
                Search
              </button>
            </div>
          </div>

          <div className={`grid transition-all duration-300 ease-in-out ${filtersOpen ? "grid-rows-[1fr] opacity-100 mt-5" : "grid-rows-[0fr] opacity-0"}`}>
            <div className="overflow-hidden">
              <div className="grid grid-cols-1 gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2">
                <FilterField label="CATEGORY" icon={<FiLayers />}>
                  <select 
                    value={filters.category}
                    onChange={(e) => updateFilter("category", e.target.value)}
                    className="h-[52px] w-full rounded-[16px] border border-slate-200 bg-white px-4 text-[15px] text-slate-700 outline-none transition-colors hover:border-slate-300 focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5]"
                  >
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </FilterField>
                
                <FilterField label="SUBCATEGORY" icon={<FiTag />}>
                  <input 
                    type="text" 
                    placeholder="e.g. smartphones" 
                    value={filters.subcategory}
                    onChange={(e) => updateFilter("subcategory", e.target.value)}
                    className="h-13 w-full rounded-2xl border border-slate-200 bg-white px-4 text-[15px] text-slate-700 outline-none transition-colors hover:border-slate-300 focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] placeholder:text-slate-400" 
                  />
                </FilterField>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-[15px] font-medium text-rose-700">
            {error}
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-110 animate-pulse rounded-4xl border border-slate-200g-slate-200/50" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map(product => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  isDeleting={deletingId === product._id}
                  onDelete={() => deleteProduct(product._id)}
                />
              ))}
            </div>
            
            {/* Pagination Placeholder */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8 pb-4">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50">
                  <FiChevronLeft />
                </button>
                <span className="text-sm font-semibold text-slate-600 px-4">Page {page} of {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50">
                  <FiChevronRight />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 rounded-4xl border border-slate-200 bg-white border-dashed">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-4">
              <FiPackage size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
            <p className="text-slate-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

function StatCard({ icon, value, label, tone }) {
  const tones = {
    cyan: "bg-[#ccf0f6] text-[#008ba0]",
    amber: "bg-amber-100 text-amber-600",
    emerald: "bg-[#dcfce7] text-[#16a34a]",
    rose: "bg-rose-100 text-rose-600",
  };

  return (
    <div className="flex flex-col rounded-[28px] border border-slate-100 bg-white p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-md">
      <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${tones[tone]}`}>
        {icon}
      </div>
      <h3 className="text-[32px] font-blacktracking-tight text-[#121926] leading-none">{value}</h3>
      <p className="mt-2 text-[14px] font-medium text-slate-500">{label}</p>
    </div>
  );
}

function FilterField({ label, icon, children }) {
  return (
    <div className="flex flex-col gap-2.5">
      <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">
        {icon && <span className="text-slate-400">{icon}</span>}
        {label}
      </label>
      {children}
    </div>
  );
}

function ProductCard({ product, isDeleting, onDelete }) {
  const stock = Number(product.stock) || 0;
  
  return (
    <div className={`group relative flex flex-col overflow-hidden rounded-4xl border border-slate-100 bg-white shadow-[0_2px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] ${isDeleting ? "opacity-60 grayscale" : ""}`}>
      {/* Image Container */}
      <div className="relative aspect-4/3 w-full shrink-0 overflow-hidden bg-slate-50">
        <ImageSlider images={product.images?.map(img => img.url)} altText={product.name} />
        
        {/* Badges */}
        {product.featured && (
          <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-950 shadow-sm z-10">
            <FiStar size={12} className="fill-amber-950" /> Featured
          </div>
        )}
        
        <div className={`absolute bottom-4 right-4 rounded-full px-3 py-1.5 text-[12px] font-bold shadow-sm z-10 ${stock > 0 ? "bg-[#dcfce7] text-[#16a34a]" : "bg-rose-100 text-rose-700"}`}>
          {stock > 0 ? `${stock} in stock` : "Out of stock"}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
        <Link to={`/products/${product._id}`} className="text-[19px] font-extrabold text-[#121926] transition-colors hover:text-[#00bad5] line-clamp-1">
          {product.name}
        </Link>
        
        <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          {[product.category, product.subcategory, product.brand].filter(Boolean).join(" · ")}
        </p>
        
        <p className="mt-3 line-clamp-1 text-[14px] text-slate-500">
          {product.shortDescription || product.description || "No description available."}
        </p>

        {/* Price & Tags */}
        <div className="mt-auto pt-5">
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-black tracking-tight text-[#121926]">
              ${(Number(product.price) || 0).toFixed(0)}
            </span>
            {(Number(product.discountPrice) || Number(product.discount) || 0) > 0 && (
              <span className="text-[14px] font-semibold text-[#16a34a]">
                -${(Number(product.discountPrice) || Number(product.discount) || 0).toFixed(0)} off
              </span>
            )}
          </div>
          
          <div className="mt-3.5 flex flex-wrap gap-2">
            {product.tags?.slice(0, 3).map(tag => (
              <span key={tag} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-1 text-[12px] font-medium text-slate-600">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Hover Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
          <div className="flex flex-wrap gap-2">
            <ActionBtn icon={<FiEye />} label="View" to={`/products/${product._id}`} />
            <ActionBtn icon={<FiEdit2 />} label="Edit" />
            <ActionBtn icon={<FiSliders />} label="Quick Edit" />
          </div>
          <button 
            disabled={isDeleting}
            onClick={onDelete}
            className="flex items-center gap-1.5 rounded-[14px] border border-rose-100 bg-rose-50 px-3.5 py-2 text-[12px] font-semibold text-rose-600 transition-colors hover:bg-rose-100 disabled:opacity-50"
          >
            <FiTrash2 size={14} />
            <span>{isDeleting ? "..." : "Delete"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ icon, label, to }) {
  const content = (
    <>
      <span className="text-slate-400">{icon}</span>
      <span>{label}</span>
    </>
  );

  const baseClass = "flex items-center gap-1.5 rounded-[14px] border border-slate-100 bg-white px-3.5 py-2 text-[12px] font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:border-slate-200 shadow-sm shadow-slate-100/50";

  if (to) {
    return <Link to={to} className={baseClass}>{content}</Link>;
  }
  return <button className={baseClass}>{content}</button>;
}

function ImageSlider({ images, altText }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const displayImages = images?.length > 0 ? images : ["https://placehold.co/600x450/f8fafc/94a3b8?text=No+Image"];
  
  const goToNext = (e) => {
    if (e) e.preventDefault();
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };
  
  const goToPrev = (e) => {
    if (e) e.preventDefault();
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  useEffect(() => {
    // Pause autoplay on hover or if there is only one image
    if (isHovered || displayImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayImages.length);
    }, 3500); // Change image every 3.5 seconds
    
    return () => clearInterval(interval);
  }, [isHovered, displayImages.length]);

  return (
    <div 
      className="relative w-full h-full group/slider"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="flex h-full w-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {displayImages.map((src, idx) => (
          <img 
            key={idx} src={src} alt={`${altText} - ${idx}`} 
            className="w-full h-full object-cover shrink-0"
          />
        ))}
      </div>
      
      {displayImages.length > 1 && isHovered && (
        <>
          <button onClick={goToPrev} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-sm hover:bg-white hover:scale-105 transition-all z-20">
            <FiChevronLeft size={16} />
          </button>
          <button onClick={goToNext} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-sm hover:bg-white hover:scale-105 transition-all z-20">
            <FiChevronRight size={16} />
          </button>
        </>
      )}
      
      {displayImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {displayImages.map((_, idx) => (
            <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentIndex ? 'bg-[#00bad5]' : 'bg-white/60'}`} />
          ))}
        </div>
      )}
    </div>
  );
}





// /////////////////////////////////////////////////////////////////////////////////////////////////////






// import { useState, useEffect, useMemo } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { 
//   FiPackage, FiPlus, FiSearch, FiSliders, FiEye, 
//   FiEdit2, FiTrash2, FiStar, FiTrendingUp, FiBox, 
//   FiLayers, FiTag, FiChevronLeft, FiChevronRight 
// } from 'react-icons/fi';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import api from "../api/api";

// const categories = ["Electronics", "Phones", "Fashion", "Home", "Beauty", "Sports"];

// export default function Products() {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [page, setPage] = useState(1);
//   const [totalProducts, setTotalProducts] = useState(0);
//   const [totalPages, setTotalPages] = useState(1);

//   const [filtersOpen, setFiltersOpen] = useState(false);
//   const [filters, setFilters] = useState({ search: "", category: "", subcategory: "" });
//   const [appliedFilters, setAppliedFilters] = useState({ search: "", category: "", subcategory: "" });

//   const [deletingId, setDeletingId] = useState("");
//   const [refreshKey, setRefreshKey] = useState(0);

//   const stats = useMemo(() => {
//     const featured = products.filter(p => p.featured).length;
//     const inStock = products.filter(p => Number(p.stock) > 0).length;
//     return {
//       total: totalProducts || products.length,
//       featured,
//       inStock,
//       outOfStock: products.filter(p => Number(p.stock) <= 0).length,
//     };
//   }, [products, totalProducts]);

//   useEffect(() => {
//     const controller = new AbortController();
    
//     async function loadProducts() {
//       setLoading(true);
//       setError(""); // مسحنا أي خطأ قديم
      
//       try {
//         const params = {
//           page,
//           limit: 12,
//           ...(appliedFilters.search && { search: appliedFilters.search }),
//           ...(appliedFilters.category && { category: appliedFilters.category }),
//           ...(appliedFilters.subcategory && { subcategory: appliedFilters.subcategory }),
//         };
//         const endpoint = appliedFilters.subcategory ? "/products/search" : "/products";
//         const { data } = await api.get(endpoint, { params, signal: controller.signal });
        
//         setProducts(Array.isArray(data.products) ? data.products : []);
//         setTotalProducts(Number(data.totalProducts) || 0);
//         setTotalPages(Number(data.totalPages) || 1);
//       } catch (err) {
//         if (err.name !== "CanceledError") {
//           console.error("Fetch Error:", err);
//           setError(err?.response?.data?.message || "Failed to load products.");
//           // ملاحظة: مش بنعمل setProducts([]) هنا عشان نمنع الـ Loop
//         }
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadProducts();
//     return () => controller.abort();
//   }, [appliedFilters, page, refreshKey]);

//   const updateFilter = (field, value) => setFilters(prev => ({ ...prev, [field]: value }));
//   const applyFilters = () => { setPage(1); setAppliedFilters({ ...filters, search: filters.search.trim() }); };

//   const deleteProduct = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this product?")) return;
    
//     const previousProducts = [...products];
//     setProducts(products.filter(p => p._id !== id));
    
//     try {
//       setDeletingId(id);
//       await api.delete(`/products/${id}`);
//       toast.success("Product deleted successfully");
//       setRefreshKey(k => k + 1);
//     } catch (err) {
//       setProducts(previousProducts);
//       toast.error(err?.response?.data?.message || "Failed to delete product.");
//     } finally {
//       setDeletingId("");
//     }
//   };

//   return (
//     <div className="min-h-screen p-4 sm:p-6 lg:p-8 text-slate-900 bg-slate-50/50">
//       <div className="mx-auto max-w-[1600px] space-y-6 lg:space-y-8">
//         
//         {/* Header Card */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-[28px] bg-linear-to-r from-[#fafdfd] via-[#f2fbfe] to-[#e0f7fc] shadow-[0_2px_20px_rgba(0,0,0,0.02)] gap-4 border border-[#e0f7fc]/50">
//           <div className="flex items-center gap-5">
//             <div className="w-15 h-15 shrink-0 flex items-center justify-center bg-[#ccf0f6] rounded-[20px]">
//               <FiPackage className="w-7 h-7 text-[#008ba0]" strokeWidth={2} />
//             </div>
//             <div className="flex flex-col justify-center pt-1">
//               <span className="text-[11px] font-bold tracking-[0.25em] text-[#20a1b6] uppercase mb-1">
//                 Product Dashboard
//               </span>
//               <h1 className="text-[32px] leading-none font-black text-[#121926] tracking-tight">
//                 Products
//               </h1>
//             </div>
//           </div>
//           <button onClick={() => navigate("/add-product")} className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#00bad5] hover:bg-[#00a3bb] active:scale-95 text-white text-[15px] font-semibold rounded-2xl transition-all shadow-[0_4px_14px_0_rgba(0,186,213,0.3)]">
//             <FiPlus className="w-5 h-5 stroke-[2.5]" />
//             Add Product
//           </button>
//         </div>

//         {/* Stats Section */}
//         <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
//           <StatCard icon={<FiBox />} value={stats.total} label="Total" tone="cyan" />
//           <StatCard icon={<FiStar />} value={stats.featured} label="Featured" tone="amber" />
//           <StatCard icon={<FiTrendingUp />} value={stats.inStock} label="In Stock" tone="emerald" />
//           <StatCard icon={<FiPackage />} value={stats.outOfStock} label="Out of Stock" tone="rose" />
//         </div>

//         {/* Search & Filters */}
//         <div className="rounded-[28px] bg-white p-5 lg:p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] border border-slate-100">
//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
//             <div className="relative flex-1 group">
//               <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00bad5] w-5 h-5 transition-colors" />
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 value={filters.search}
//                 onChange={(e) => updateFilter("search", e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && applyFilters()}
//                 className="h-13 w-full rounded-2xl border border-slate-200 bg-[#fafdfd] pl-12 pr-4 text-[15px] text-[#121926] outline-none transition-all focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] placeholder:text-slate-400"
//               />
//             </div>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setFiltersOpen(!filtersOpen)}
//                 className={`flex h-13 items-center justify-center gap-2 rounded-2xl border px-6 text-[15px] font-semibold transition-colors ${
//                   filtersOpen 
//                     ? "border-[#00bad5] bg-[#e0f7fc] text-[#008ba0]" 
//                     : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
//                 }`}
//               >
//                 <FiSliders className="w-4 h-4" />
//                 Filters
//               </button>
//               <button 
//                 onClick={applyFilters}
//                 className="flex h-13 items-center justify-center gap-2 rounded-2xl bg-[#00bad5] hover:bg-[#00a3bb] px-8 text-[15px] font-semibold text-white transition-all shadow-[0_4px_14px_0_rgba(0,186,213,0.2)]"
//               >
//                 Search
//               </button>
//             </div>
//           </div>

//           <div className={`grid transition-all duration-300 ease-in-out ${filtersOpen ? "grid-rows-[1fr] opacity-100 mt-5" : "grid-rows-[0fr] opacity-0"}`}>
//             <div className="overflow-hidden">
//               <div className="grid grid-cols-1 gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2">
//                 <FilterField label="CATEGORY" icon={<FiLayers />}>
//                   <select 
//                     value={filters.category}
//                     onChange={(e) => updateFilter("category", e.target.value)}
//                     className="h-[52px] w-full rounded-[16px] border border-slate-200 bg-white px-4 text-[15px] text-slate-700 outline-none transition-colors hover:border-slate-300 focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5]"
//                   >
//                     <option value="">All Categories</option>
//                     {categories.map(c => <option key={c} value={c}>{c}</option>)}
//                   </select>
//                 </FilterField>
//                 
//                 <FilterField label="SUBCATEGORY" icon={<FiTag />}>
//                   <input 
//                     type="text" 
//                     placeholder="e.g. smartphones" 
//                     value={filters.subcategory}
//                     onChange={(e) => updateFilter("subcategory", e.target.value)}
//                     className="h-13 w-full rounded-2xl border border-slate-200 bg-white px-4 text-[15px] text-slate-700 outline-none transition-colors hover:border-slate-300 focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] placeholder:text-slate-400" 
//                   />
//                 </FilterField>
//               </div>
//             </div>
//           </div>
//         </div>

//         {error && (
//           <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-[15px] font-medium text-rose-700">
//             {error}
//           </div>
//         )}

//         {/* Products Grid */}
//         {loading ? (
//           <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {Array.from({ length: 8 }).map((_, i) => (
//               <div key={i} className="h-110 animate-pulse rounded-4xl border border-slate-200g-slate-200/50" />
//             ))}
//           </div>
//         ) : products.length > 0 ? (
//           <>
//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//               {products.map(product => (
//                 <ProductCard 
//                   key={product._id} 
//                   product={product} 
//                   isDeleting={deletingId === product._id}
//                   onDelete={() => deleteProduct(product._id)}
//                 />
//               ))}
//             </div>
//             
//             {/* Pagination Placeholder */}
//             {totalPages > 1 && (
//               <div className="flex items-center justify-center gap-2 pt-8 pb-4">
//                 <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50">
//                   <FiChevronLeft />
//                 </button>
//                 <span className="text-sm font-semibold text-slate-600 px-4">Page {page} of {totalPages}</span>
//                 <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50">
//                   <FiChevronRight />
//                 </button>
//               </div>
//             )}
//           </>
//         ) : (
//           <div className="flex flex-col items-center justify-center py-20 rounded-4xl border border-slate-200 bg-white border-dashed">
//             <div className="w-20 h-20 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-4">
//               <FiPackage size={32} />
//             </div>
//             <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
//             <p className="text-slate-500">Try adjusting your search or filters.</p>
//           </div>
//         )}
//       </div>
//       <ToastContainer position="bottom-right" />
//     </div>
//   );
// }

// function StatCard({ icon, value, label, tone }) {
//   const tones = {
//     cyan: "bg-[#ccf0f6] text-[#008ba0]",
//     amber: "bg-amber-100 text-amber-600",
//     emerald: "bg-[#dcfce7] text-[#16a34a]",
//     rose: "bg-rose-100 text-rose-600",
//   };

//   return (
//     <div className="flex flex-col rounded-[28px] border border-slate-100 bg-white p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-md">
//       <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${tones[tone]}`}>
//         {icon}
//       </div>
//       <h3 className="text-[32px] font-blacktracking-tight text-[#121926] leading-none">{value}</h3>
//       <p className="mt-2 text-[14px] font-medium text-slate-500">{label}</p>
//     </div>
//   );
// }

// function FilterField({ label, icon, children }) {
//   return (
//     <div className="flex flex-col gap-2.5">
//       <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">
//         {icon && <span className="text-slate-400">{icon}</span>}
//         {label}
//       </label>
//       {children}
//     </div>
//   );
// }

// function ProductCard({ product, isDeleting, onDelete }) {
//   const stock = Number(product.stock) || 0;
//   
//   return (
//     <div className={`group relative flex flex-col overflow-hidden rounded-4xl border border-slate-100 bg-white shadow-[0_2px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] ${isDeleting ? "opacity-60 grayscale" : ""}`}>
//       {/* Image Container */}
//       <div className="relative aspect-4/3 w-full shrink-0 overflow-hidden bg-slate-50">
//         <ImageSlider images={product.images?.map(img => img.url)} altText={product.name} />
//         
//         {/* Badges */}
//         {product.featured && (
//           <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-950 shadow-sm z-10">
//             <FiStar size={12} className="fill-amber-950" /> Featured
//           </div>
//         )}
//         
//         <div className={`absolute bottom-4 right-4 rounded-full px-3 py-1.5 text-[12px] font-bold shadow-sm z-10 ${stock > 0 ? "bg-[#dcfce7] text-[#16a34a]" : "bg-rose-100 text-rose-700"}`}>
//           {stock > 0 ? `${stock} in stock` : "Out of stock"}
//         </div>
//       </div>

//       {/* Content */}
//       <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
//         <Link to={`/products/${product._id}`} className="text-[19px] font-extrabold text-[#121926] transition-colors hover:text-[#00bad5] line-clamp-1">
//           {product.name}
//         </Link>
//         
//         <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
//           {[product.category, product.subcategory, product.brand].filter(Boolean).join(" · ")}
//         </p>
//         
//         <p className="mt-3 line-clamp-1 text-[14px] text-slate-500">
//           {product.shortDescription || product.description || "No description available."}
//         </p>

//         {/* Price & Tags */}
//         <div className="mt-auto pt-5">
//           <div className="flex items-baseline gap-2">
//             <span className="text-[32px] font-black tracking-tight text-[#121926]">
//               ${(Number(product.price) || 0).toFixed(0)}
//             </span>
//             {(Number(product.discountPrice) || Number(product.discount) || 0) > 0 && (
//               <span className="text-[14px] font-semibold text-[#16a34a]">
//                 -${(Number(product.discountPrice) || Number(product.discount) || 0).toFixed(0)} off
//               </span>
//             )}
//           </div>
//           
//           <div className="mt-3.5 flex flex-wrap gap-2">
//             {product.tags?.slice(0, 3).map(tag => (
//               <span key={tag} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-1 text-[12px] font-medium text-slate-600">
//                 {tag}
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* Hover Actions */}
//         <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
//           <div className="flex flex-wrap gap-2">
//             <ActionBtn icon={<FiEye />} label="View" to={`/products/${product._id}`} />
//             <ActionBtn icon={<FiEdit2 />} label="Edit" />
//             <ActionBtn icon={<FiSliders />} label="Quick Edit" />
//           </div>
//           <button 
//             disabled={isDeleting}
//             onClick={onDelete}
//             className="flex items-center gap-1.5 rounded-[14px] border border-rose-100 bg-rose-50 px-3.5 py-2 text-[12px] font-semibold text-rose-600 transition-colors hover:bg-rose-100 disabled:opacity-50"
//           >
//             <FiTrash2 size={14} />
//             <span>{isDeleting ? "..." : "Delete"}</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function ActionBtn({ icon, label, to }) {
//   const content = (
//     <>
//       <span className="text-slate-400">{icon}</span>
//       <span>{label}</span>
//     </>
//   );

//   const baseClass = "flex items-center gap-1.5 rounded-[14px] border border-slate-100 bg-white px-3.5 py-2 text-[12px] font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:border-slate-200 shadow-sm shadow-slate-100/50";

//   if (to) {
//     return <Link to={to} className={baseClass}>{content}</Link>;
//   }
//   return <button className={baseClass}>{content}</button>;
// }

// function ImageSlider({ images, altText }) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isHovered, setIsHovered] = useState(false);
//   
//   const displayImages = images?.length > 0 ? images : ["https://placehold.co/600x450/f8fafc/94a3b8?text=No+Image"];
//   
//   const goToNext = (e) => {
//     if (e) e.preventDefault();
//     setCurrentIndex((prev) => (prev + 1) % displayImages.length);
//   };
//   
//   const goToPrev = (e) => {
//     if (e) e.preventDefault();
//     setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
//   };

//   useEffect(() => {
//     // Pause autoplay on hover or if there is only one image
//     if (isHovered || displayImages.length <= 1) return;
//     
//     const interval = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % displayImages.length);
//     }, 3500); // Change image every 3.5 seconds
//     
//     return () => clearInterval(interval);
//   }, [isHovered, displayImages.length]);

//   return (
//     <div 
//       className="relative w-full h-full group/slider"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div 
//         className="flex h-full w-full transition-transform duration-500 ease-in-out"
//         style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//       >
//         {displayImages.map((src, idx) => (
//           <img 
//             key={idx} src={src} alt={`${altText} - ${idx}`} 
//             className="w-full h-full object-cover shrink-0"
//           />
//         ))}
//       </div>
//       
//       {displayImages.length > 1 && isHovered && (
//         <>
//           <button onClick={goToPrev} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-sm hover:bg-white hover:scale-105 transition-all z-20">
//             <FiChevronLeft size={16} />
//           </button>
//           <button onClick={goToNext} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-sm hover:bg-white hover:scale-105 transition-all z-20">
//             <FiChevronRight size={16} />
//           </button>
//         </>
//       )}
//       
//       {displayImages.length > 1 && (
//         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
//           {displayImages.map((_, idx) => (
//             <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentIndex ? 'bg-[#00bad5]' : 'bg-white/60'}`} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


// // ... ضيفي باقي المكونات (StatCard, FilterField, ProductCard, ActionBtn, ImageSlider) زي ما هي تحت