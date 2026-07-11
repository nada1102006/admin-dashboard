import React, { useState, useEffect, useRef } from 'react';
import { FiX } from 'react-icons/fi';
import axios from 'axios';

export default function QuickEdit({ productId, isOpen, onClose }) {
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const BASE_URL = "https://e-commerce-api-3wara.vercel.app/api";

  const [product, setProduct] = useState({
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
    tags: "",
    featured: false,
    active: false,
  });

  const [images, setImages] = useState([]);

  // ==========================================
  // Side Effects (Data Fetching)
  // ==========================================
  useEffect(() => {
    if (isOpen && productId) {
      const fetchProductData = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${BASE_URL}/products/${productId}`);
          if (response.data) {
            const data = response.data;
            setProduct({
              name: data.name || "",
              shortDescription: data.shortDescription || "",
              description: data.description || "",
              price: data.price || "",
              discountPrice: data.discountPrice || "",
              stock: data.stock || "",
              sku: data.sku || "",
              category: data.category || "",
              subcategory: data.subcategory || "",
              brand: data.brand || "",
              tags: Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || ""),
              featured: !!data.featured,
              active: !!data.active,
            });
            setImages(data.images || []);
          }
        } catch (err) {
          console.error("Error fetching product:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchProductData();
    }
  }, [isOpen, productId]);

  // ==========================================
  // Form Handlers
  // ==========================================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    const updatedData = {
      ...product,
      tags: product.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ""),
      price: Number(product.price),
      discountPrice: Number(product.discountPrice),
      stock: Number(product.stock),
      images: images,
    };
    try {
      const response = await axios.put(`${BASE_URL}/products/${productId}`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log('Product updated successfully:', response.data);
      alert('Product saved successfully!');
      onClose();
    } catch (err) {
      console.error("Error updating product:", err);
      setError(err.response?.data?.message || "Failed to save product data.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Image Management Handlers
  // ==========================================
  const handleImageUpload = (event) => {
    const files = event.target.files;
    if (files) {
      const newImages = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result);
          if (newImages.length === files.length) {
            setImages((prevImages) => [...prevImages, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // ==========================================
  // Component Render
  // ==========================================
  return (
    <div className="p-8 flex justify-center items-center min-h-screen bg-slate-900/50">
      
      {/* Trigger Button */}
     

      {/* Modal Layout */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[1150px] overflow-hidden my-auto flex flex-col max-h-[92vh] relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-slate-50">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg tracking-wide">
                <span className="w-2 h-2 rounded-full bg-sky-500 inline-block"></span>
                <span>Edit Product</span>
              </div>
             <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">
                <FiX size={16} />
              </button>
            </div>

            {/* Error & Loading States */}
            {error && (
              <div className="mx-8 mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}
            {loading && (
              <div className="absolute inset-0 bg-white/70 z-40 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-sky-500 border-t-transparent"></div>
              </div>
            )}

            {/* Main Form Fields */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-8 pb-8 pt-6 grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Left Column: Media Section */}
              <div className="md:col-span-5 flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2.5 bg-sky-50 text-sky-500 border border-sky-100 rounded-xl">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Product Gallery</h4>
                    <p className="text-[11px] text-slate-400 font-medium">Upload and manage images</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {images.map((url, num) => (
                    <div key={num} className="group relative rounded-2xl overflow-hidden h-28 bg-slate-100 border border-slate-200">
                      <img src={url} alt={`Product ${num + 1}`} className="w-full h-full object-cover grayscale brightness-95" />
                      <span className="absolute bottom-2 left-3 text-white text-xs font-semibold drop-shadow-md">Image {num + 1}</span>
                      <button 
                        type="button" 
                        onClick={() => removeImage(num)} 
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <FiX size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} multiple accept="image/png, image/jpeg, image/webp" />
                <div onClick={triggerFileUpload} className="flex flex-col items-center justify-center text-center gap-1.5 p-6 border-2 border-dashed border-sky-200 rounded-2xl bg-sky-50/20 hover:bg-sky-50/40 transition-all min-h-[110px] cursor-pointer">
                  <div className="text-sky-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <p className="font-bold text-slate-700 text-xs">Click to upload images</p>
                  <p className="text-[10px] text-slate-400 font-medium">PNG, JPG, WEBP</p>
                </div>
              </div>

              {/* Right Column: Info Details Section */}
              <div className="md:col-span-7 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Name <span className="text-red-400">*</span></label>
                  <input type="text" name="name" value={product.name} onChange={handleChange} className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:border-sky-400 focus:bg-white transition-all" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Short Description <span className="text-red-400">*</span></label>
                  <input type="text" name="shortDescription" value={product.shortDescription} onChange={handleChange} className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:border-sky-400 focus:bg-white transition-all" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description <span className="text-red-400">*</span></label>
                  <textarea name="description" rows={4} value={product.description} onChange={handleChange} className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-xs leading-relaxed focus:outline-none focus:border-sky-400 focus:bg-white transition-all resize-none overflow-y-auto" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price</label><input type="text" name="price" value={product.price} onChange={handleChange} className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:border-sky-400 focus:bg-white transition-all" /></div>
                  <div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Discount Price</label><input type="text" name="price" value={product.discountPrice} onChange={handleChange} className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:border-sky-400 focus:bg-white transition-all" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stock</label><input type="text" name="stock" value={product.stock} onChange={handleChange} className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:border-sky-400 focus:bg-white transition-all" /></div>
                  <div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SKU</label><input type="text" name="sku" value={product.sku} onChange={handleChange} className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:border-sky-400 focus:bg-white transition-all" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                    <div className="relative">
                      <select name="category" value={product.category} onChange={handleChange} className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:border-sky-400 focus:bg-white transition-all appearance-none cursor-pointer">
                        <option value="fashion">fashion</option>
                        <option value="electronics">electronics</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500"><svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subcategory</label>
                    <div className="relative">
                      <select name="subcategory" value={product.subcategory} onChange={handleChange} className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:border-sky-400 focus:bg-white transition-all appearance-none cursor-pointer">
                        <option value="clothes">clothes</option>
                        <option value="shoes">shoes</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500"><svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg></div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Brand</label><input type="text" name="brand" value={product.brand} onChange={handleChange} className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:border-sky-400 focus:bg-white transition-all" /></div>
                  <div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tags</label><input type="text" name="tags" value={product.tags} onChange={handleChange} className="w-full bg-white border-2 border-sky-400 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none transition-all shadow-sm shadow-sky-100" /></div>
                </div>
                <div className="flex gap-6 mt-1 px-1 select-none">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <div className="relative flex items-center justify-center"><input type="checkbox" name="featured" checked={product.featured} onChange={handleChange} className="sr-only peer" /><div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white peer-checked:border-sky-500 flex items-center justify-center transition-all"><div className="w-2.5 h-2.5 rounded-full bg-sky-500 scale-0 peer-checked:scale-100 transition-all"></div></div></div>
                    <span className="text-slate-600 font-semibold text-sm">Featured</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <div className="relative flex items-center justify-center"><input type="checkbox" name="active" checked={product.active} onChange={handleChange} className="sr-only peer" /><div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white peer-checked:border-sky-500 flex items-center justify-center transition-all"><div className="w-2.5 h-2.5 rounded-full bg-sky-500 scale-0 peer-checked:scale-100 transition-all"></div></div></div>
                    <span className="text-slate-600 font-semibold text-sm">Active</span>
                  </label>
                </div>
              </div>

            </form>

            {/* Modal Footer (Action Buttons) */}
            <div className="flex justify-end items-center gap-3 px-8 py-4 bg-white border-t border-slate-100">
              <button type="button" onClick={onClose} className="px-6 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 bg-[#f1f5f9] hover:bg-slate-200 rounded-xl transition-all">Cancel</button>
              <button type="submit" onClick={handleSave} disabled={loading} className="px-6 py-2.5 text-xs font-bold text-white bg-[#00a3e0] hover:bg-[#0284c7] rounded-xl transition-all shadow-sm disabled:opacity-50">{loading ? "Saving..." : "Save Product"}</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}