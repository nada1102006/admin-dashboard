import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiImage, FiPlus, FiStar, FiX } from 'react-icons/fi';
import api from '../api/api';
import { toast } from 'react-toastify';

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
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

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

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

    if (images.length + files.length > 5) {
      toast.error("You can only upload up to 5 images.");
      return;
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
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
    if (images.length === 0) {
      toast.error("Please upload at least one image.");
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
        data.append("tags", JSON.stringify(tags));
      }

      // Append images
      images.forEach(image => {
        data.append("images", image);
      });

      await api.post("/products", data);
      toast.success("Product created successfully!");
      navigate("/products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 min-h-screen bg-slate-50/50 text-slate-900 mx-auto max-w-[1600px] dark:bg-slate-950">

      <div className="relative overflow-hidden rounded-[32px] border border-slate-800 bg-gradient-to-br from-[#0a0f1c] via-[#0d1526] to-[#0a0f1c] p-8 shadow-2xl">
       
        <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-[#00bad5]/15 blur-3xl "></div>
        <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-blue-500/15 blur-3xl "></div>
        
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between ">
          <div>
            
            <Link to="/products" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:bg-white/10 transition-colors">
              <FiArrowLeft size={16} />
              Back to products
            </Link>
            
            <div className="mt-5 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#14283f] text-[#38bdf8]">
                <FiPackage size={24} />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[11px] font-bold tracking-[0.25em] text-[#38bdf8] uppercase mb-1">
                  Create Product
                </span>
                <h1 className="text-[32px] sm:text-4xl leading-none font-black text-white tracking-tight">
                  Launch a polished product entry
                </h1>
              </div>
            </div>
            <p className="mt-4 max-w-2xl text-[15px] text-slate-400 font-medium">Add products with validation, image previews, multi-upload support, and smooth UX.</p>
          </div>
          
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-md">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#38bdf8]">Ready</p>
            <p className="mt-1.5 text-[14px] font-medium text-slate-300">Create, validate, and save with one click.</p>
          </div>
        </div>
      </div>

      
      <form onSubmit={handleSubmit} className="grid gap-6 lg:gap-8 xl:grid-cols-[0.95fr_1.05fr] dark:dark:bg-slate-950">
     
        <section className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] dark:bg-gray-900 dark:border border-gray-800">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ccf0f6]/50 text-[#008ba0] dark:text-blue-500 dark:bg-blue-500/10">
              <FiImage size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight text-[#121926] dark:text-white dark:">Gallery *</h3>
              <p className="text-sm font-medium text-slate-500 mt-0.5 dark:text-gray-400">Upload up to 5 images and preview instantly.</p>
            </div>
          </div>
          
          {/* Image Previews Grid */}
          {imagePreviews.length > 0 && (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {imagePreviews.map((preview, idx) => (
                <article key={idx} className="group relative overflow-hidden rounded-[20px] border border-slate-100 bg-slate-50 shadow-sm">
                  <div className="flex h-48 items-center justify-center">
                    <img src={preview} alt={`preview-${idx}`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 shadow-sm">
                    Image {idx + 1}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeImage(idx)}
                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100 shadow-md hover:bg-red-600"
                  >
                    <FiX size={16} />
                  </button>
                </article>
              ))}
            </div>
          )}
          
          {images.length < 5 && (
            <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#00bad5]/30 bg-[#f2fbfe] p-10 text-center transition-all hover:bg-[#e0f7fc] hover:border-[#00bad5]/50 group bg-white dark:bg-gray-950 dark:hover:bg-slate-900 ">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm transition-transform group-hover:scale-110 group-hover:shadow-md">
                <FiImage size={24}  className="text-[#00bad5] dark:text-blue-500 dark:bg-blue-500/10" />
              </div>
              <p className="text-[17px] font-bold text-[#121926] dark:text-white">Upload images</p>
              <p className="mt-1.5 text-sm font-medium text-slate-500">PNG, JPG, WEBP • multiple files supported ({5 - images.length} left)</p>
              <input hidden type="file" accept="image/*" multiple onChange={handleImageChange} />
            </label>
          )}
          
          <div className="mt-6 rounded-2xl border border-[#dcfce7] bg-[#f0fdf4] p-5 dark:bg-slate-900/50 dark:border-teal-900/50 ">
            <div className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-[#16a34a] dark:text-teal-400">
              <FiStar size={16} className="fill-[#16a34a]/20" />
              Upload Tips
            </div>
            <p className="mt-2 text-[14px] font-medium text-[#16a34a]/90 leading-relaxed dark:text-gray-300">Use high-quality images (preferably 1:1 ratio) for the best display on the store. The first image will be used as the thumbnail.</p>
          </div>
        </section>

        {/*PRODUCT DETAILS FORM */}
        <section className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] dark:bg-gray-900 dark:border border-gray-800">
          <div className="grid gap-6">
            
            <label className="block">
              <span className="mb-2 block text-[13px] font-bold text-slate-700 uppercase tracking-wide dark:text-white">Product Name *</span>
              <input required name="name" value={formData.name} onChange={handleChange} placeholder="e.g. iPhone 16 Pro" className="h-14 w-full px-5 outline-none transition-all text-[15px] rounded-2xl border border-slate-200 bg-[#fafdfd] text-black placeholder:text-slate-400 focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] dark:border-gray-800 dark:bg-slate-900 dark:text-white" />
            </label>

            
            <label className="block">
              <span className="mb-2 block text-[13px] font-bold text-slate-700 uppercase tracking-wide dark:text-white dark:text-white">Short Description *</span>
              <input required name="shortDescription" value={formData.shortDescription} onChange={handleChange} placeholder="Minimum 10 characters" className="h-14 w-full px-5 text-[15px] outline-none transition-all rounded-2xl border border-slate-200 bg-[#fafdfd] text-black placeholder:text-slate-400 focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] dark:border-gray-800 dark:bg-slate-900 dark:text-white" />
            </label>

            <label className="block">
              <span className="mb-2 block text-[13px] font-bold text-slate-700 uppercase tracking-wide dark:text-white dark:text-white">Description *</span>
              <textarea required name="description" value={formData.description} onChange={handleChange} rows="5" placeholder="Minimum 20 characters" className="w-full rounded-2xl border border-slate-200 bg-[#fafdfd] px-5 py-4 text-[15px] outline-none transition-all focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] placeholder:text-slate-400 dark:bg-slate-950 border border-gray-800 text-black rounded-lg p-3 dark:bg-slate-950 border border-gray-800 dark:text-white rounded-lg p-3"></textarea>
            </label>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[13px] font-bold text-slate-700 uppercase tracking-wide dark:text-white">Price ($) *</span>
                <input required type="number" step="1" name="price" value={formData.price} onChange={handleChange} placeholder="0" className="h-14 w-full rounded-2xl border border-slate-200 bg-[#fafdfd] px-5 text-[15px] outline-none transition-all focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] placeholder:text-slate-400 dark:bg-slate-950 dark:text-white border border-gray-800 text-black rounded-lg p-3" />
              </label>
              <label className="block">
                <span className="mb-2 block text-[13px] font-bold text-slate-700 uppercase tracking-wide dark:text-white">Discount Price ($)</span>
                <input type="number" step="1" name="discountPrice" value={formData.discountPrice} onChange={handleChange} placeholder="0" className="h-14 w-full rounded-2xl border border-slate-200 bg-[#fafdfd] px-5 text-[15px] outline-none transition-all focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] placeholder:text-slate-400 dark:bg-slate-950 border border-gray-800 text-black rounded-lg p-3 dark:text-white" />
              </label>
            </div>

            
            <div className="grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[13px] font-bold text-slate-700 uppercase  tracking-wide dark:text-white">Stock *</span>
                <input required type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="0" className="h-14 w-full rounded-2xl border border-slate-200 bg-[#fafdfd] px-5 text-[15px] outline-none transition-all focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] placeholder:text-slate-400 dark:bg-slate-950 border border-gray-800 text-black rounded-lg p-3 dark:bg-slate-950  dark:text-white" />
              </label>
              <label className="block">
                <span className="mb-2 block text-[13px] font-bold text-slate-700 uppercase  tracking-wide dark:text-white">SKU</span>
                <input name="sku" value={formData.sku} onChange={handleChange} placeholder="e.g. IPH-16-PRO" className="h-14 w-full rounded-2xl border border-slate-200 bg-[#fafdfd] px-5 text-[15px] outline-none transition-all focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] placeholder:text-slate-400 dark:bg-slate-950 border border-gray-800 text-black rounded-lg p-3 dark:bg-slate-950 dark:text-white" />
              </label>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[13px] font-bold text-slate-700 uppercase tracking-wide dark:text-white">Category *</span>
                <select required name="category" value={formData.category} onChange={handleChange} className="h-14 w-full rounded-2xl border border-slate-200 bg-[#fafdfd] px-5 text-[15px] outline-none transition-all focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] dark:bg-slate-950 border border-gray-800 text-black rounded-lg p-3 dark:text-white">
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Phones">Phones</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home">Home</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Sports">Sports</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-[13px] font-bold text-slate-700 uppercase tracking-wide dark:text-white dark:text-white">Subcategory</span>
                <input name="subcategory" value={formData.subcategory} onChange={handleChange} placeholder="e.g. smartphones" className="h-14 w-full rounded-2xl border border-slate-200 bg-[#fafdfd] px-5 text-[15px] outline-none transition-all focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] placeholder:text-slate-400 dark:bg-slate-950 border border-gray-800 text-black rounded-lg p-3 dark:bg-slate-950 dark:text-white" />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-[13px] font-bold text-slate-700 uppercase tracking-wide dark:text-white">Brand</span>
              <input name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g. Apple" className="h-14 w-full rounded-2xl border border-slate-200 bg-[#fafdfd] px-5 text-[15px] outline-none transition-all focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] placeholder:text-slate-400 dark:bg-slate-950 border border-gray-800 text-black rounded-lg p-3 dark:bg-slate-950 dark:text-white" />
            </label>

            <div className="rounded-[24px] border border-slate-100 bg-slate-50 p-6 dark:bg-slate-950 border border-gray-800 text-white rounded-lg p-3">
              <label className="block">
                <span className="mb-3 block text-[13px] font-bold text-slate-700 uppercase tracking-wide dark:bg-slate-950 border border-gray-800 text-black rounded-lg p-3 dark:text-white">Tags</span>
                <div className="flex gap-3 dark:bg-slate-950 border border-gray-800 text-white rounded-lg p-3">
                  <input 
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Type a tag and press +" 
                    className="h-14 flex-1 rounded-2xl border border-slate-200 bg-white px-5 text-[15px] outline-none transition-all focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] placeholder:text-slate-400 dark:bg-slate-950 border border-gray-800 text-black rounded-lg p-3 dark:text-white" 
                  />
                  <button type="button" onClick={handleAddTag} className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200 text-slate-600 shadow-sm transition hover:bg-slate-300">
                    <FiPlus size={24} />
                  </button>
                </div>
              </label>
              <div className="mt-4 flex flex-wrap gap-2 dark:bg-slate-950 border border-gray-800 text-white rounded-lg p-3">
                {tags.length === 0 && <p className="text-sm font-medium text-slate-500">Add one or more tags to organize the product.</p>}
                {tags.map((tag, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-[13px] font-semibold text-slate-700 shadow-sm">
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
              <label className="flex flex-1 sm:flex-none items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 cursor-pointer hover:bg-slate-50 transition-colors shadow-sm dark:bg-slate-950 border border-gray-800 text-white rounded-lg p-3">
                <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-5 h-5 accent-[#00bad5]" />
                <span className="text-[15px] font-bold text-slate-700 dark:text-white">Featured</span>
              </label>
              <label className="flex flex-1 sm:flex-none items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 cursor-pointer hover:bg-slate-50 transition-colors shadow-sm dark:bg-slate-950 border border-gray-800 text-white rounded-lg p-3">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 accent-[#00bad5] dark:bg-slate-950 border border-gray-800 text-white rounded-lg p-3" />
                <span className="text-[15px] font-bold text-slate-700 dark:text-white">Active</span>
              </label>
            </div>

            <div className="flex items-center justify-start gap-3 border-t border-slate-100 pt-6 mt-2">
              <Link to="/products" className="flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-[14px] font-bold transition-all bg-blue-600 text-black border border-slate-200 hover:bg-slate-50 active:scale-[0.98] dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600 ">
                Cancel
              </Link>
              <button disabled={loading} className="flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-[14px] font-bold transition-all bg-[#00bad5] text-white shadow-[0_4px_14px_0_rgba(0,186,213,0.3)] hover:bg-[#00a3bb] hover:shadow-[0_6px_20px_0_rgba(0,186,213,0.4)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed" type="submit">
                {loading ? "Creating..." : "Create Product"}
              </button>
            </div>
          </div>
        </section>
      </form>
    </main>
  );
}