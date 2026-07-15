import React, { useState, useRef } from 'react';
import { FiX, FiImage, FiLoader, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../api/api';

export default function QuickEdit({ product: initialProduct, onClose, onSuccess }) {
  const [product, setProduct] = useState({
    _id: initialProduct._id,
    name: initialProduct.name || initialProduct.title || "",
    shortDescription: initialProduct.shortDescription || "",
    description: initialProduct.description || "",
    price: initialProduct.price || "",
    discountPrice: initialProduct.discountPrice || "",
    stock: initialProduct.stock || "",
    sku: initialProduct.sku || "",
    category: initialProduct.category || "",
    subcategory: initialProduct.subcategory || "",
    brand: initialProduct.brand || "",
    featured: initialProduct.featured || false,
    isActive: initialProduct.isActive !== undefined ? initialProduct.isActive : (initialProduct.active !== undefined ? initialProduct.active : true)
  });
  
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState(Array.isArray(initialProduct.tags) ? initialProduct.tags : []);
  const [tagInput, setTagInput] = useState("");
  
  const fileInputRef = useRef(null);
  
  const [existingImages, setExistingImages] = useState(initialProduct.images || []);
  const [deletedImages, setDeletedImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  
  const imagePreviews = [
    ...existingImages.map(img => typeof img === 'string' ? img : img.url || ""),
    ...newImages.map(file => URL.createObjectURL(file))
  ];

  const triggerFileUpload = () => fileInputRef.current?.click();

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const availableSlots = 5 - imagePreviews.length;
    const allowedFiles = files.slice(0, availableSlots);

    if (files.length > availableSlots) {
      toast.error(`You can only upload up to 5 images. Only ${allowedFiles.length} were added.`);
    }

    if (allowedFiles.length === 0) return;
    setNewImages(prev => [...prev, ...allowedFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index) => {
    if (index < existingImages.length) {
      const imgToRemove = existingImages[index];
      if (imgToRemove && imgToRemove.public_id) {
        setDeletedImages(prev => [...prev, imgToRemove.public_id]);
      }
      setExistingImages(prev => prev.filter((_, idx) => idx !== index));
    } else {
      const newIndex = index - existingImages.length;
      setNewImages(prev => prev.filter((_, idx) => idx !== newIndex));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags(prev => [...prev, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (imagePreviews.length === 0) {
      return toast.error("Please ensure there is at least one image.");
    }

    setLoading(true);
    
    try {
      const data = new FormData();
      Object.keys(product).forEach(key => {
        if (key !== '_id' && product[key] !== "") {
          data.append(key, product[key]);
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

      newImages.forEach(image => {
        data.append("images", image);
      });

      if (deletedImages.length > 0) {
        data.append("deletedImages", JSON.stringify(deletedImages));
      }

      await api.patch(`/products/update/${product._id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      toast.success("Product updated successfully!");
      onSuccess();
    } catch (err) {
      console.error("Update Error:", err);
      if (err.response?.data?.errors) {
        const errs = err.response.data.errors;
        if (Array.isArray(errs) && errs.length > 0) {
          toast.error(errs.join(", "));
        } else if (typeof errs === 'string') {
          toast.error(errs);
        } else {
          toast.error(JSON.stringify(errs));
        }
      } else {
        toast.error(err.response?.data?.message || "Failed to update product");
      }
    } finally {
      setLoading(false);
    }
  };

  const categories = ["Electronics", "Phones", "Fashion", "Home", "Beauty", "Sports"];
  const formatCategory = (cat) => {
    if (!cat) return "";
    const matched = categories.find(opt => opt.toLowerCase() === cat.toLowerCase());
    return matched || cat;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm transition-all" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-[28px] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200 dark:border-slate-800">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          <h2 className="font-extrabold text-xl tracking-tight text-[#121926] dark:text-white">Quick Edit</h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200/50 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"><FiX size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <form className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Media & Status */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-slate-50 dark:bg-slate-950/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">Media ({imagePreviews.length}/5)</label>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {imagePreviews.map((img, num) => (
                    <div key={num} className="group relative rounded-xl overflow-hidden aspect-square bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <img src={img} alt="Product" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(num)} className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100 shadow-md hover:bg-red-600">
                        <FiX size={12} />
                      </button>
                    </div>
                  ))}
                  {imagePreviews.length < 5 && (
                    <div onClick={triggerFileUpload} className="rounded-xl border-2 border-dashed border-[#00bad5]/30 bg-[#f2fbfe] dark:bg-sky-950/20 dark:border-sky-500/30 flex flex-col items-center justify-center cursor-pointer hover:bg-[#e0f7fc] dark:hover:bg-sky-900/40 transition-colors aspect-square">
                      <FiImage className="text-[#00bad5] mb-1" size={20} />
                      <span className="text-[10px] font-bold text-[#00bad5]">Upload</span>
                    </div>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} multiple accept="image/*" />
              </div>

              <div className="bg-slate-50 dark:bg-slate-950/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 block">Status</label>
                 <div className="flex flex-col gap-3">
                   <label className="flex items-center gap-3 cursor-pointer group">
                     <input type="checkbox" name="featured" checked={product.featured} onChange={handleChange} className="w-5 h-5 accent-[#00bad5] rounded border-slate-300" /> 
                     <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-[#00bad5] transition-colors">Featured Product</span>
                   </label>
                   <label className="flex items-center gap-3 cursor-pointer group">
                     <input type="checkbox" name="isActive" checked={product.isActive} onChange={handleChange} className="w-5 h-5 accent-[#00bad5] rounded border-slate-300" /> 
                     <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-[#00bad5] transition-colors">Active Listing</span>
                   </label>
                 </div>
              </div>
            </div>

            {/* Right Column: Inputs */}
            <div className="lg:col-span-8 flex flex-col gap-5">
              
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-[11px] uppercase text-slate-500 font-bold tracking-wider">Product Name *</label>
                  <input name="name" value={product.name} onChange={handleChange} className="w-full h-12 bg-[#fafdfd] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 text-sm focus:outline-none focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] transition-all" required />
                </div>
                
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-[11px] uppercase text-slate-500 font-bold tracking-wider">Short Description *</label>
                  <input name="shortDescription" value={product.shortDescription} onChange={handleChange} className="w-full h-12 bg-[#fafdfd] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 text-sm focus:outline-none focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] transition-all" required />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] uppercase text-slate-500 font-bold tracking-wider">Price (EGP) *</label>
                  <input name="price" type="number" value={product.price} onChange={handleChange} className="w-full h-12 bg-[#fafdfd] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 text-sm focus:outline-none focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] transition-all" min="0" step="1" required />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] uppercase text-slate-500 font-bold tracking-wider">Discount Price (EGP)</label>
                  <input name="discountPrice" type="number" value={product.discountPrice} onChange={handleChange} className="w-full h-12 bg-[#fafdfd] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 text-sm focus:outline-none focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] transition-all" min="0" step="1" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] uppercase text-slate-500 font-bold tracking-wider">Stock *</label>
                  <input name="stock" type="number" value={product.stock} onChange={handleChange} className="w-full h-12 bg-[#fafdfd] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 text-sm focus:outline-none focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] transition-all" min="0" required />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] uppercase text-slate-500 font-bold tracking-wider">SKU</label>
                  <input name="sku" value={product.sku} onChange={handleChange} className="w-full h-12 bg-[#fafdfd] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 text-sm focus:outline-none focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] transition-all" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] uppercase text-slate-500 font-bold tracking-wider">Category *</label>
                  <select name="category" value={formatCategory(product.category)} onChange={handleChange} className="w-full h-12 bg-[#fafdfd] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 text-sm focus:outline-none focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] transition-all" required>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    {product.category && !categories.includes(formatCategory(product.category)) && (
                      <option value={product.category}>{product.category}</option>
                    )}
                  </select>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] uppercase text-slate-500 font-bold tracking-wider">Brand</label>
                  <input name="brand" value={product.brand} onChange={handleChange} className="w-full h-12 bg-[#fafdfd] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 text-sm focus:outline-none focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] transition-all" />
                </div>
                
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-[11px] uppercase text-slate-500 font-bold tracking-wider">Tags</label>
                  <div className="flex gap-2">
                    <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} className="flex-1 h-12 bg-[#fafdfd] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 text-sm focus:outline-none focus:border-[#00bad5] focus:ring-1 focus:ring-[#00bad5] transition-all" placeholder="Type a tag and press +" />
                    <button type="button" onClick={handleAddTag} className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors">
                      <FiPlus size={20} />
                    </button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[12px] font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                          {tag}
                          <button type="button" onClick={() => handleRemoveTag(tag)} className="text-slate-400 hover:text-red-500"><FiX size={14} /></button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          </form>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-xl transition-colors">Cancel</button>
          <button type="button" onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-8 py-2.5 bg-[#00bad5] hover:bg-[#00a3bb] active:scale-95 disabled:opacity-50 disabled:active:scale-100 rounded-xl text-sm font-bold text-white shadow-[0_4px_14px_0_rgba(0,186,213,0.3)] transition-all">
            {loading ? (<><FiLoader className="animate-spin" size={16} /> Saving...</>) : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}