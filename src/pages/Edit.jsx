import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiImage, FiPlus, FiStar, FiX } from 'react-icons/fi';
import api from '../api/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EditProductSkeleton } from '../components/Skeleton/EditProductSkeleton/EditProductSkeleton';
import useTheme from '../components/customHook/useTheme';

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    sku: "",
    category: "",
    subcategory: "",
    brand: "",
    featured: false,
    isActive: true,
  });

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const [deletedImages, setDeletedImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        const data = response.data?.product || response.data?.data || response.data;
        
        const formatCategory = (cat) => {
          if (!cat) return "";
          const options = ["Electronics", "Phones", "Fashion", "Home", "Beauty", "Sports"];
          const matched = options.find(opt => opt.toLowerCase() === cat.toLowerCase());
          return matched || cat;
        };

        setFormData({
          name: data.name || data.title || "",
          shortDescription: data.shortDescription || "",
          description: data.description || "",
          price: data.price || "",
          discountPrice: data.discountPrice || "",
          stock: data.stock || "",
          sku: data.sku || "",
          category: formatCategory(data.category),
          subcategory: data.subcategory || "",
          brand: data.brand || "",
          featured: data.featured || false,
          isActive: data.isActive !== undefined ? data.isActive : (data.active !== undefined ? data.active : true),
        });

        if (Array.isArray(data.tags)) {
          setTags(data.tags);
        }

        if (Array.isArray(data.images) && data.images.length > 0) {
          setExistingImages(data.images);
          setImagePreviews(data.images.map(img => typeof img === 'string' ? img : img.url || ""));
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load product details.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Skeleton loading state
  if (isFetching) {
    const skeletonBaseColor = isDarkMode ? "#1e293b" : "#e2e8f0";
    const skeletonHighlightColor = isDarkMode ? "#334155" : "#f1f5f9";

    return (
      <EditProductSkeleton
        baseColor={skeletonBaseColor}
        highlightColor={skeletonHighlightColor}
      />
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const availableSlots = 5 - imagePreviews.length;
    const allowedFiles = files.slice(0, availableSlots);

    if (files.length > availableSlots) {
      toast.error(`You can only upload up to 5 images. Only ${allowedFiles.length} were added.`);
    }

    if (allowedFiles.length === 0) return;

    const newPreviews = allowedFiles.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...allowedFiles]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (indexToRemove) => {
    if (indexToRemove < existingImages.length) {
      const imgToRemove = existingImages[indexToRemove];
      if (imgToRemove && imgToRemove.public_id) {
        setDeletedImages(prev => [...prev, imgToRemove.public_id]);
      }
      setExistingImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
    } else {
      const newImageIndex = indexToRemove - existingImages.length;
      setImages(prev => prev.filter((_, idx) => idx !== newImageIndex));
    }
    setImagePreviews(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags(prev => [...prev, trimmed]);
      setTagInput("");
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imagePreviews.length === 0) {
      toast.error("Please ensure there is at least one image.");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== "") {
          data.append(key, formData[key]);
        }
      });
      
      if (tags.length > 0) {
        if (tags.length === 1) {
          data.append("tags", tags[0]);
          data.append("tags", tags[0]);
        } else {
          tags.forEach(tag => data.append("tags", tag));
        }
      }

      if (deletedImages.length > 0) {
        data.append("deletedImages", JSON.stringify(deletedImages));
      }

      images.forEach((image, index) => {
        const ext = image.name.split('.').pop() || 'jpg';
        const safeName = `upload_${Date.now()}_${index}.${ext}`;
        const safeFile = new File([image], safeName, { type: image.type });
        data.append("images", safeFile);
        
        if (images.length === 1) {
          data.append("images", safeFile);
        }
      });

      await api.patch(`/products/update/${id}`, data);
      toast.success("Product updated successfully!");
      setTimeout(() => {
        navigate("/products");
      }, 1500);
    } catch (error) {
      console.error("Update Product Error:", error);
      if (error.response?.data?.errors) {
        const errs = error.response.data.errors;
        if (Array.isArray(errs) && errs.length > 0) {
          toast.error(errs.join(", "));
        } else if (typeof errs === 'string') {
          toast.error(errs);
        } else {
          toast.error(JSON.stringify(errs));
        }
      } else {
        toast.error(error.response?.data?.message || "Failed to update product");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 min-h-screen bg-slate-50/50 text-slate-900 mx-auto max-w-[1600px] dark:bg-slate-900">
      <div className="slide-up">
        
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 p-8 shadow-lg transition-all duration-300 hover:shadow-xl mb-8">
          <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-500/5"></div>
          <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-500/5"></div>
          
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link 
                to="/products" 
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 backdrop-blur-sm transition-all"
              >
                <FiArrowLeft size={16} />
                Back to products
              </Link>
              
              <div className="mt-5 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-500 text-white shadow-lg shadow-cyan-500/30">
                  <FiPackage size={24} />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-[11px] font-bold tracking-[0.25em] text-sky-500 dark:text-sky-400 uppercase mb-1">
                    Edit Product
                  </span>
                  <h1 className="text-[32px] sm:text-4xl leading-none font-black text-slate-900 dark:text-white tracking-tight">
                    Update product details
                  </h1>
                </div>
              </div>
              <p className="mt-4 max-w-2xl text-[15px] text-slate-500 dark:text-slate-400 font-medium">
                Edit product information, manage gallery, and adjust availability seamlessly.
              </p>
            </div>
            
            <div className="rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 p-5 shadow-lg backdrop-blur-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-sky-500 dark:text-sky-400">Live Update</p>
              <p className="mt-1.5 text-[14px] font-medium text-slate-600 dark:text-slate-300">Changes will be visible immediately.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          
          <section className="rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-500 text-white shadow-lg shadow-cyan-500/30">
                <FiImage size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Gallery *</h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">Upload up to 5 images and preview instantly.</p>
              </div>
            </div>
            
            {imagePreviews.length > 0 && (
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {imagePreviews.map((preview, idx) => (
                  <article key={idx} className="group relative overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 shadow-sm transition-all duration-300 hover:shadow-md">
                    <div className="flex h-48 items-center justify-center">
                      <img src={preview} alt={`preview-${idx}`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300 shadow-sm">
                      Image {idx + 1}
                    </div>
                    {idx >= existingImages.length && (
                      <div className="absolute top-3 right-14 bg-gradient-to-r from-cyan-500 to-sky-500 backdrop-blur px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-sm">
                        New
                      </div>
                    )}
                    <button 
                      type="button" 
                      onClick={() => removeImage(idx)}
                      className="absolute cursor-pointer top-3 right-3 flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-rose-500 to-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100 shadow-lg shadow-rose-500/30 hover:from-rose-600 hover:to-red-600"
                    >
                      <FiX size={16} />
                    </button>
                  </article>
                ))}
              </div>
            )}
            
            {imagePreviews.length < 5 && (
              <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-cyan-500/30 dark:border-cyan-500/20 bg-cyan-50/50 dark:bg-slate-800/30 p-10 text-center transition-all hover:bg-cyan-100/50 dark:hover:bg-slate-800/50 hover:border-cyan-500/50 group">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white dark:bg-slate-700 shadow-sm transition-transform group-hover:scale-110 group-hover:shadow-md">
                  <FiImage size={24} className="text-cyan-500" />
                </div>
                <p className="text-[17px] font-bold text-slate-900 dark:text-white">Upload images</p>
                <p className="mt-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">PNG, JPG, WEBP • multiple files supported ({5 - imagePreviews.length} left)</p>
                <input hidden type="file" accept="image/*" multiple onChange={handleImageChange} />
              </label>
            )}
            
            <div className="mt-6 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-950/20 p-5">
              <div className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <FiStar size={16} className="fill-emerald-600/20 dark:fill-emerald-400/20" />
                Upload Tips
              </div>
              <p className="mt-2 text-[14px] font-medium text-emerald-600/90 dark:text-emerald-400/80 leading-relaxed">
                Use high-quality images (preferably 1:1 ratio) for the best display on the store. The first image will be used as the thumbnail.
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="grid gap-6">
              
              <label className="block">
                <span className="mb-2 block text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Product Name *</span>
                <input required name="name" value={formData.name} onChange={handleChange} placeholder="e.g. iPhone 16 Pro" className="h-14 w-full px-5 outline-none transition-all text-[15px] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 backdrop-blur-sm" />
              </label>

              <label className="block">
                <span className="mb-2 block text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Short Description *</span>
                <input required name="shortDescription" value={formData.shortDescription} onChange={handleChange} placeholder="Minimum 10 characters" className="h-14 w-full px-5 text-[15px] outline-none transition-all rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 backdrop-blur-sm" />
              </label>

              <label className="block">
                <span className="mb-2 block text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Description *</span>
                <textarea required name="description" value={formData.description} onChange={handleChange} rows="5" placeholder="Minimum 20 characters" className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/50 px-5 py-4 text-[15px] outline-none transition-all focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-400 text-slate-900 dark:text-white backdrop-blur-sm"></textarea>
              </label>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Price (EGP) *</span>
                  <input required type="number" step="1" name="price" value={formData.price} onChange={handleChange} placeholder="0" className="h-14 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/50 px-5 text-[15px] outline-none transition-all focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-400 text-slate-900 dark:text-white backdrop-blur-sm" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Discount Price (EGP)</span>
                  <input type="number" step="1" name="discountPrice" value={formData.discountPrice} onChange={handleChange} placeholder="0" className="h-14 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/50 px-5 text-[15px] outline-none transition-all focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-400 text-slate-900 dark:text-white backdrop-blur-sm" />
                </label>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Stock *</span>
                  <input required type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="0" className="h-14 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/50 px-5 text-[15px] outline-none transition-all focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-400 text-slate-900 dark:text-white backdrop-blur-sm" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">SKU</span>
                  <input name="sku" value={formData.sku} onChange={handleChange} placeholder="e.g. IPH-16-PRO" className="h-14 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/50 px-5 text-[15px] outline-none transition-all focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-400 text-slate-900 dark:text-white backdrop-blur-sm" />
                </label>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Category *</span>
                  <select required name="category" value={formData.category} onChange={handleChange} className="h-14 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/50 px-5 text-[15px] outline-none transition-all focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-900 dark:text-white backdrop-blur-sm">
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Phones">Phones</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home">Home</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Sports">Sports</option>
                    {formData.category && !["Electronics", "Phones", "Fashion", "Home", "Beauty", "Sports"].includes(formData.category) && (
                      <option value={formData.category}>{formData.category}</option>
                    )}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Subcategory</span>
                  <input name="subcategory" value={formData.subcategory} onChange={handleChange} placeholder="e.g. smartphones" className="h-14 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/50 px-5 text-[15px] outline-none transition-all focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-400 text-slate-900 dark:text-white backdrop-blur-sm" />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Brand</span>
                <input name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g. Apple" className="h-14 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/50 px-5 text-[15px] outline-none transition-all focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-400 text-slate-900 dark:text-white backdrop-blur-sm" />
              </label>

              <div className="rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 p-6 backdrop-blur-sm">
                <label className="block">
                  <span className="mb-3 block text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Tags</span>
                  <div className="flex gap-3">
                    <input 
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder="Type a tag and press +" 
                      className="h-14 flex-1 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/50 px-5 text-[15px] outline-none transition-all focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-400 text-slate-900 dark:text-white backdrop-blur-sm" 
                    />
                    <button type="button" onClick={handleAddTag} className="inline-flex cursor-pointer h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 text-white shadow-lg shadow-cyan-500/30 transition hover:from-cyan-600 hover:to-sky-600">
                      <FiPlus size={24} />
                    </button>
                  </div>
                </label>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tags.length === 0 && <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Add one or more tags to organize the product.</p>}
                  {tags.map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 px-3 py-1.5 text-[13px] font-semibold text-slate-700 dark:text-slate-300 shadow-sm backdrop-blur-sm">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="text-slate-400 cursor-pointer hover:text-rose-500 transition-colors">
                        <FiX size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-2">
                <label className="flex flex-1 sm:flex-none items-center justify-center gap-3 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 px-6 py-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all backdrop-blur-sm shadow-sm">
                  <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-5 h-5 accent-cyan-500" />
                  <span className="text-[15px] font-bold text-slate-700 dark:text-slate-300">Featured</span>
                </label>
                <label className="flex flex-1 sm:flex-none items-center justify-center gap-3 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 px-6 py-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all backdrop-blur-sm shadow-sm">
                  <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 accent-cyan-500" />
                  <span className="text-[15px] font-bold text-slate-700 dark:text-slate-300">Active</span>
                </label>
              </div>

              <div className="flex items-center justify-start gap-3 border-t border-slate-200/50 dark:border-slate-700/50 pt-6 mt-2">
                <Link to="/products" className="flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-[14px] font-bold transition-all bg-white/70 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 active:scale-[0.98] backdrop-blur-sm">
                  Cancel
                </Link>
                <button disabled={loading} className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl px-6 py-3 text-[14px] font-bold transition-all bg-gradient-to-r from-cyan-500 to-sky-500 text-white shadow-lg shadow-cyan-500/30 hover:from-cyan-600 hover:to-sky-600 hover:shadow-xl hover:shadow-cyan-500/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed" type="submit">
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </section>
        </form>
        <ToastContainer position="bottom-right" theme="colored" />
      </div>
    </main>
  );
}