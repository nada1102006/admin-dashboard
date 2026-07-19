import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiImage, FiPlus, FiStar, FiX } from 'react-icons/fi';
import api from '../api/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLanguage } from '../Context/LanguageContext';

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { t } = useLanguage();
  
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
          data.append("tags", tags[0]); // Force multer to treat as array
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
        
        // Force backend to parse as array if there is only 1 new image
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

  if (isFetching) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50/50 dark:bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#00bad5] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 min-h-screen bg-slate-50/50 text-slate-900 mx-auto max-w-[1600px] dark:bg-slate-950">

      <div className="relative overflow-hidden rounded-[32px] border border-slate-800 bg-gradient-to-br from-[#0a0f1c] via-[#0d1526] to-[#0a0f1c] p-8 shadow-2xl">
       
        <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-[#00bad5]/15 blur-3xl "></div>
        <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-blue-500/15 blur-3xl "></div>
        
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between ">
          <div>
            
            <Link to="/products" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:bg-white/10 transition-colors">
              <FiArrowLeft size={16} />
              {t("editProduct.backToProducts")}
            </Link>
            
            <div className="mt-5 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#14283f] text-[#38bdf8]">
                <FiPackage size={24} />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[11px] font-bold tracking-[0.25em] text-[#38bdf8] uppercase mb-1">
                  {t("editProduct.editProduct")}
                </span>
                <h1 className="text-[32px] sm:text-4xl leading-none font-black text-white tracking-tight">
                  {t("editProduct.updateTitle")}
                </h1>
              </div>
            </div>
            <p className="mt-4 max-w-2xl text-[15px] text-slate-400 font-medium">{t("editProduct.updateDesc")}</p>
          </div>
          
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-md">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#38bdf8]">{t("editProduct.liveUpdate")}</p>
            <p className="mt-1.5 text-[14px] font-medium text-slate-300">{t("editProduct.liveUpdateDesc")}</p>
          </div>
        </div>
      </div>

      
      <form onSubmit={handleSubmit} className="grid gap-6 lg:gap-8 xl:grid-cols-[0.95fr_1.05fr]">
     
        <section className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ccf0f6]/50 text-[#008ba0] dark:bg-[#00bad5]/20 dark:text-[#00bad5]">
              <FiImage size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight text-[#121926] dark:text-white">{t("addProduct.gallery")}</h3>
              <p className="text-sm font-medium text-slate-500 mt-0.5 dark:text-slate-400">{t("addProduct.galleryDesc")}</p>
            </div>
          </div>
          
          {imagePreviews.length > 0 && (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {imagePreviews.map((preview, idx) => (
                <article key={idx} className="group relative overflow-hidden rounded-[20px] border border-slate-100 bg-slate-50 shadow-sm dark:bg-slate-800 dark:border-slate-700">
                  <div className="flex h-48 items-center justify-center">
                    <img src={preview} alt={`preview-${idx}`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="absolute top-3 inset-inline-start-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 shadow-sm dark:bg-slate-900/80 dark:text-slate-300">
                    {t("addProduct.image")} {idx + 1}
                  </div>
                  {idx >= existingImages.length && (
                    <div className="absolute top-3 inset-inline-end-14 bg-[#00bad5]/90 backdrop-blur px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-sm">
                      {t("editProduct.new")}
                    </div>
                  )}
                  <button 
                    type="button" 
                    onClick={() => removeImage(idx)}
                    className="absolute top-3 inset-inline-end-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100 shadow-md hover:bg-red-600"
                  >
                    <FiX size={16} />
                  </button>
                </article>
              ))}
            </div>
          )}
          
          {imagePreviews.length < 5 && (
            <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#00bad5]/30 bg-[#f2fbfe] p-10 text-center transition-all hover:bg-[#e0f7fc] hover:border-[#00bad5]/50 group dark:bg-slate-900/50 dark:border-[#00bad5]/20 dark:hover:bg-slate-900">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm transition-transform group-hover:scale-110 group-hover:shadow-md dark:bg-slate-800">
                <FiImage size={24} className="text-[#00bad5]" />
              </div>
              <p className="text-[17px] font-bold text-[#121926] dark:text-white">{t("addProduct.uploadImages")}</p>
              <p className="mt-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">{t("addProduct.uploadFormats")} ({5 - imagePreviews.length} {t("addProduct.left")})</p>
              <input hidden type="file" accept="image/*" multiple onChange={handleImageChange} />
            </label>
          )}
          
          <div className="mt-6 rounded-2xl border border-[#dcfce7] bg-[#f0fdf4] p-5 dark:bg-slate-900/50 dark:border-teal-900/50 ">
            <div className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-[#16a34a] dark:text-teal-400">
              <FiStar size={16} className="fill-[#16a34a]/20" />
              {t("addProduct.uploadTips")}
            </div>
            <p className="mt-2 text-[14px] font-medium text-[#16a34a]/90 leading-relaxed dark:text-gray-300">{t("addProduct.uploadTipsDesc")}</p>
          </div>
        </section>

        {/*PRODUCT DETAILS FORM */}
        <section className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] dark:bg-slate-900 dark:border-slate-800">
          <div className="grid gap-6">
            
            <label className="block">
              <span className="mb-2 block text-[13px] font-bold text-slate-700 uppercase tracking-wide dark:text-white">{t("addProduct.productName")}</span>
              <input required name="name" value={formData.name} onChange={handleChange} placeholder="e.g. iPhone 16 Pro" className="h-14 w-full px-5 outline-none transition-all text-[15px] rounded-2xl border border-slate-200 bg-[#fafdfd] text-black placeholder:text-slate-400 focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] dark:border-slate-800 dark:bg-slate-950 dark:text-white" />
            </label>

            <label className="block">
              <span className="mb-2 block text-[13px] font-bold text-slate-700 uppercase tracking-wide dark:text-white">{t("addProduct.shortDesc")}</span>
              <input required name="shortDescription" value={formData.shortDescription} onChange={handleChange} placeholder="Minimum 10 characters" className="h-14 w-full px-5 text-[15px] outline-none transition-all rounded-2xl border border-slate-200 bg-[#fafdfd] text-black placeholder:text-slate-400 focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] dark:border-slate-800 dark:bg-slate-950 dark:text-white" />
            </label>

            <label className="block">
              <span className="mb-2 block text-[13px] font-bold text-slate-700 uppercase tracking-wide dark:text-white">{t("addProduct.description")}</span>
              <textarea required name="description" value={formData.description} onChange={handleChange} rows="5" placeholder="Minimum 20 characters" className="w-full rounded-2xl border border-slate-200 bg-[#fafdfd] px-5 py-4 text-[15px] outline-none transition-all focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] placeholder:text-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white"></textarea>
            </label>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[13px] font-bold text-slate-700 uppercase tracking-wide dark:text-white">{t("addProduct.price")}</span>
                <input required type="number" step="1" name="price" value={formData.price} onChange={handleChange} placeholder="0" className="h-14 w-full rounded-2xl border border-slate-200 bg-[#fafdfd] px-5 text-[15px] outline-none transition-all focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] placeholder:text-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white text-black" />
              </label>
              <label className="block">
                <span className="mb-2 block text-[13px] font-bold text-slate-700 uppercase tracking-wide dark:text-white">{t("addProduct.discountPrice")}</span>
                <input type="number" step="1" name="discountPrice" value={formData.discountPrice} onChange={handleChange} placeholder="0" className="h-14 w-full rounded-2xl border border-slate-200 bg-[#fafdfd] px-5 text-[15px] outline-none transition-all focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] placeholder:text-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white text-black" />
              </label>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[13px] font-bold text-slate-700 uppercase tracking-wide dark:text-white">{t("addProduct.stock")}</span>
                <input required type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="0" className="h-14 w-full rounded-2xl border border-slate-200 bg-[#fafdfd] px-5 text-[15px] outline-none transition-all focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] placeholder:text-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white text-black" />
              </label>
              <label className="block">
                <span className="mb-2 block text-[13px] font-bold text-slate-700 uppercase tracking-wide dark:text-white">{t("addProduct.sku")}</span>
                <input name="sku" value={formData.sku} onChange={handleChange} placeholder="e.g. IPH-16-PRO" className="h-14 w-full rounded-2xl border border-slate-200 bg-[#fafdfd] px-5 text-[15px] outline-none transition-all focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] placeholder:text-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white text-black" />
              </label>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[13px] font-bold text-slate-700 uppercase tracking-wide dark:text-white">{t("addProduct.categoryLabel")}</span>
                <select required name="category" value={formData.category} onChange={handleChange} className="h-14 w-full rounded-2xl border border-slate-200 bg-[#fafdfd] px-5 text-[15px] outline-none transition-all focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] dark:border-slate-800 dark:bg-slate-950 dark:text-white text-black">
                  <option value="">{t("addProduct.selectCategory")}</option>
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
                <span className="mb-2 block text-[13px] font-bold text-slate-700 uppercase tracking-wide dark:text-white">{t("addProduct.subcategoryLabel")}</span>
                <input name="subcategory" value={formData.subcategory} onChange={handleChange} placeholder="e.g. smartphones" className="h-14 w-full rounded-2xl border border-slate-200 bg-[#fafdfd] px-5 text-[15px] outline-none transition-all focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] placeholder:text-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white text-black" />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-[13px] font-bold text-slate-700 uppercase tracking-wide dark:text-white">{t("addProduct.brand")}</span>
              <input name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g. Apple" className="h-14 w-full rounded-2xl border border-slate-200 bg-[#fafdfd] px-5 text-[15px] outline-none transition-all focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] placeholder:text-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white text-black" />
            </label>

            <div className="rounded-[24px] border border-slate-100 bg-slate-50 p-6 dark:bg-slate-900/50 dark:border-slate-800">
              <label className="block">
                <span className="mb-3 block text-[13px] font-bold text-slate-700 uppercase tracking-wide dark:text-white">{t("addProduct.tags")}</span>
                <div className="flex gap-3">
                  <input 
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder={t("addProduct.tagPlaceholder")} 
                    className="h-14 flex-1 rounded-2xl border border-slate-200 bg-white px-5 text-[15px] outline-none transition-all focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white text-black" 
                  />
                  <button type="button" onClick={handleAddTag} className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200 text-slate-600 shadow-sm transition hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                    <FiPlus size={24} />
                  </button>
                </div>
              </label>
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.length === 0 && <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{t("addProduct.tagHint")}</p>}
                {tags.map((tag, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-[13px] font-semibold text-slate-700 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="text-slate-400 hover:text-red-500 transition-colors">
                      <FiX size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Toggle Switches (Featured & Active) */}
            <div className="flex flex-wrap gap-4 mt-2">
              <label className="flex flex-1 sm:flex-none items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 cursor-pointer hover:bg-slate-50 transition-colors shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900">
                <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-5 h-5 accent-[#00bad5]" />
                <span className="text-[15px] font-bold text-slate-700 dark:text-white">{t("addProduct.featuredLabel")}</span>
              </label>
              <label className="flex flex-1 sm:flex-none items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 cursor-pointer hover:bg-slate-50 transition-colors shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 accent-[#00bad5]" />
                <span className="text-[15px] font-bold text-slate-700 dark:text-white">{t("addProduct.activeLabel")}</span>
              </label>
            </div>

            <div className="flex items-center justify-start gap-3 border-t border-slate-100 dark:border-slate-800 pt-6 mt-2">
              <Link to="/products" className="flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-[14px] font-bold transition-all bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 active:scale-[0.98] dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700">
                {t("addProduct.cancel")}
              </Link>
              <button disabled={loading} className="flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-[14px] font-bold transition-all bg-[#00bad5] text-white shadow-[0_4px_14px_0_rgba(0,186,213,0.3)] hover:bg-[#00a3bb] hover:shadow-[0_6px_20px_0_rgba(0,186,213,0.4)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed" type="submit">
                {loading ? t("editProduct.saving") : t("editProduct.saveChanges")}
              </button>
            </div>
          </div>
        </section>
      </form>
      <ToastContainer position="bottom-right" theme="colored" />
    </main>
  );
}