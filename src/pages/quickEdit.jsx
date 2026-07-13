
import React, { useState, useRef } from 'react';
import { FiX, FiImage } from 'react-icons/fi';
import axios from 'axios';

export default function QuickEdit({ product: initialProduct, onClose, onSuccess }) {
const [product, setProduct] = useState({
      ...initialProduct,
      name: initialProduct.name || "",
      shortDescription: initialProduct.shortDescription || "",
      description: initialProduct.description || "",
      price: initialProduct.price || 0,
      discountPrice: initialProduct.discountPrice || 0,
      stock: initialProduct.stock || 0,
      sku: initialProduct.sku || "",
      category: initialProduct.category || "fashion",
      subcategory: initialProduct.subcategory || "clothes",
      brand: initialProduct.brand || "",
      tags: initialProduct.tags || "",
      featured: initialProduct.featured || false,
      active: initialProduct.active || false
  });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [images, setImages] = useState(initialProduct.images || []);

  const BASE_URL = "https://e-commerce-api-3wara.vercel.app/" 

  const triggerFileUpload = () => fileInputRef.current?.click();

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImageUrls = files.map(file => ({ url: URL.createObjectURL(file) }));
    setImages(prev => [...prev, ...newImageUrls]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!product._id) {
        alert("Error: Product ID is missing!");
        return;
    }
       console.log("الرابط هو:", `${BASE_URL}/products/${product._id}`);
    setLoading(true);
    try {
    
      const response = await axios.put(`${BASE_URL}/products/${product._id}`, {
          ...product,
          images: images, 
          price: Number(product.price),
          discountPrice: Number(product.discountPrice),
          stock: Number(product.stock)
      });
      
      onSuccess();
    } catch (err) {
      console.error("Save Error Details:", err); 
      alert(err.response?.data?.message || "Failed to save. Check Console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm">
      <div className="bg-[#0f172a] text-white rounded-[24px] shadow-2xl w-full max-w-[1150px] overflow-hidden flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-700">
          <h2 className="font-bold text-lg">Edit Product</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1.5"><FiX size={20} /></button>
        </div>

        <form className="flex-1 overflow-y-auto px-8 py-6 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column: Media */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              {images.map((img, num) => (
                <div key={num} className="relative rounded-2xl overflow-hidden h-32 bg-slate-800 border border-slate-700">
                  <img src={img.url || img} alt="Product" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(num)} className="absolute bottom-2 left-2 bg-slate-900/50 hover:bg-red-600 px-3 py-1 text-[10px] rounded-lg border border-slate-600 transition-all">
                    Remove
                  </button>
                </div>
              ))}
            </div>
            
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} multiple accept="image/*" />
            <div onClick={triggerFileUpload} className="border-2 border-dashed border-slate-700 rounded-2xl p-8 text-center cursor-pointer hover:border-sky-500 transition-all">
              <p className="text-sm">Click to upload images</p>
              <p className="text-[10px] text-slate-500">PNG, JPG, WEBP</p>
            </div>
          </div>

          {/* Right Column: Inputs */}
          <div className="md:col-span-7 flex flex-col gap-4">
            <input name="name" value={product.name} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm" placeholder="Product Name" />
            <input name="shortDescription" value={product.shortDescription} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm" placeholder="Short Description" />
            <textarea name="description" rows={4} value={product.description} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm" placeholder="Description" />
            
            <div className="grid grid-cols-2 gap-4">
              <input name="price" value={product.price} onChange={handleChange} className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm" placeholder="Price" />
              <input name="discountPrice" value={product.discountPrice} onChange={handleChange} className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm" placeholder="Discount Price" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input name="stock" value={product.stock} onChange={handleChange} className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm" placeholder="Stock" />
              <input name="sku" value={product.sku} onChange={handleChange} className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm" placeholder="SKU" />
            </div>
        
<div className="grid grid-cols-2 gap-4">
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] uppercase text-slate-500 font-bold">Category</label>
    <select name="category" value={product.category} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm">
      <option value="fashion">Fashion</option>
      <option value="electronics">Electronics</option>
    </select>
  </div>
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] uppercase text-slate-500 font-bold">Subcategory</label>
    <select name="subcategory" value={product.subcategory} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm">
      <option value="clothes">Clothes</option>
      <option value="shoes">Shoes</option>
    </select>
  </div>
</div>

<div className="grid grid-cols-2 gap-4">
  <input name="brand" value={product.brand} onChange={handleChange} className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm" placeholder="Brand" />
  <input name="tags" value={product.tags} onChange={handleChange} className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm" placeholder="Tags (comma separated)" />
</div>

{/* خانات التفعيل والتمييز */}
<div className="flex gap-6 mt-2">
  <label className="flex items-center gap-2 text-sm cursor-pointer">
    <input type="checkbox" name="featured" checked={product.featured} onChange={handleChange} className="w-4 h-4" />
    Featured
  </label>
  <label className="flex items-center gap-2 text-sm cursor-pointer">
    <input type="checkbox" name="active" checked={product.active} onChange={handleChange} className="w-4 h-4" />
    Active
  </label>
</div>
          </div>
        </form>

        <div className="flex justify-end gap-3 px-8 py-4 border-t border-slate-700">
          <button onClick={onClose} className="px-6 py-2 text-sm font-bold">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 bg-sky-600 rounded-xl text-sm font-bold">Save Product</button>
        </div>
      </div>
    </div>
  );
}