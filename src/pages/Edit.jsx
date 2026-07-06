import React, { useState, useEffect, useRef } from 'react';

function Edit() {
  const [product, setProduct] = useState({
    title: "",
    shortDescription: "",
    description: "",
    price: 0,
    discountPrice: 0,
    stock: 0,
    sku: "",
    category: "fashion",
    subcategory: "clothes",
    brand: "",
    tags: [], 
    featured: false,
    active: true
  });

  const [loading, setLoading] = useState(true);
  const [tagInput, setTagInput] = useState(""); 
  const [images, setImages] = useState([
    "/docs/images/blog/image-1.jpg",
    "/docs/images/blog/image-2.jpg",
    "/docs/images/blog/image-3.jpg",
    "/docs/images/blog/image-4.jpg"
  ]);

  const productId = "1"; 
  const fileInputRef = useRef(null);

  // ==========================================
  // Effects
  // ==========================================
  useEffect(() => {
    setLoading(true);
    fetch(`https://e-commerce-api-3wara.vercel.app/api/products/${productId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          setProduct({
            title: data.title || "",
            shortDescription: data.shortDescription || "",
            description: data.description || "",
            price: data.price || 0,
            discountPrice: data.discountPrice || 0,
            stock: data.stock || 0,
            sku: data.sku || "",
            category: data.category || "fashion",
            subcategory: data.subcategory || "clothes",
            brand: data.brand || "",
            tags: data.tags || [],
            featured: data.featured || false,
            active: data.active !== undefined ? data.active : true
          });

          if (data.images && data.images.length > 0) {
            setImages(data.images);
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setLoading(false);
      });
  }, [productId]);

  // ==========================================
  // Form & Input Handlers
  // ==========================================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // ==========================================
  // Tag Management
  // ==========================================
  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !product.tags.includes(trimmedTag)) {
      setProduct((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }));
      setTagInput(""); 
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setProduct((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove)
    }));
  };

  // ==========================================
  // Image Management
  // ==========================================
  const handleDivClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const newImageUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setImages((prevImages) => [...prevImages, ...newImageUrls]);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
  };

  // ==========================================
  // Save Action
  // ==========================================
  const handleSave = (e) => {
    e.preventDefault(); 

    const updatedProduct = {
      ...product,
      images: images 
    };

    fetch(`https://e-commerce-api-3wara.vercel.app/api/products/${productId}`, {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("تم تحديث المنتج بنجاح!");
        console.log("البيانات المحدثة:", data);
      })
      .catch((error) => {
        console.error("حدث خطأ أثناء التحديث:", error);
        alert("فشل تحديث المنتج.");
      });
  };

  // ==========================================
  // Loading State Render
  // ==========================================
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#f1f5f9]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-bold text-slate-600">Loading Product Data...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // Main Component Render
  // ==========================================
  return (
    <>
      <section className="edit-section w-full bg-[#f1f5f9] p-4 md:p-6">
        
        {/* Header Block */}
        <div className="edit-container w-full mb-6">
          <div className="edit-header w-full h-auto p-6 bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#0f172a] text-white rounded-3xl ">
            <div className="back-btn mb-6">
              <button 
                type="button" 
                className="inline-flex items-center gap-2 bg-[#ffffff10] border border-[#ffffff15] hover:bg-[#ffffff20] text-gray-200 hover:text-white cursor-pointer font-medium rounded-full text-xs px-4 py-2 transition-all duration-200 focus:outline-none"
              >
                <i className="fa-solid fa-arrow-left text-sm"></i>
                Back to products
              </button>
            </div>

            <div className="edit-mid flex gap-4">
              <div className="edit-mid-icon p-4 inline-flex items-center gap-2 bg-[#ffffff10] font-medium rounded-xl text-xl px-4 py-4 transition-all duration-200 focus:outline-none">
                <i className="fa-solid fa-box"></i>
              </div>
              
              <div className="edit-mid-text flex flex-col gap-4">
                <div className="edit-mid-title">
                  <p className='tracking-widest text-[#c4b5fd]'>Edit Product</p>
                </div>
                <div className="edit-mid-desc">
                  <h1 className='text-2xl md:text-4xl font-extrabold'>Update and refine the product entry</h1>
                </div>
              </div>
            </div>

            <div className="edit-header-end flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 py-2">
              <div className="edit-end-desc">
                <p className='text-[#cbd5e1]'>Review the current product data, add new images, remove existing ones, and save your updates safely.</p>
              </div>

              <div className="live-container bg-[#ffffff10] border border-[#ffffff15] p-6 rounded-3xl w-full lg:w-auto">
                <div className="live-top">
                  <p className='tracking-widest text-[#c4b5fd]'>LIVE</p>
                </div>
                <div className="live-bottom">
                  <p>Connected to the real product update API.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="forms flex flex-col lg:flex-row gap-6 items-stretch">
          
          {/* Gallery Sidebar */}
          <div className="left-side w-full lg:flex-1 p-6 bg-white shadow-xl rounded-3xl flex flex-col gap-6">
            <div className="edit-left flex gap-4">
              <div className="edit-left-icon p-4 inline-flex items-center gap-2 bg-[#8b5cf61a] text-[#a78bfa] font-medium rounded-xl text-xl px-4 py-4 transition-all duration-200 focus:outline-none">
                <i className="fa-regular fa-image"></i>
              </div>
              
              <div className="edit-left-text flex flex-col gap-2">
                <div className="edit-left-title">
                  <p className='font-extrabold text-xl'>Product Gallery</p>
                </div>
                <div className="edit-left-desc">
                  <h1 className='text-[#64748b] text-sm'>Keep existing images, add new ones, or remove selected assets before saving.</h1>
                </div>
              </div>
            </div>
            
            <div className="edit-left-cards grid grid-cols-1 sm:grid-cols-2 gap-4">
              {images.map((imgSrc, index) => (
                <div key={index} className="bg-slate-50 pb-3 border border-slate-100 rounded-3xl text-center relative group">
                  <img className="rounded-t-2xl w-full h-40 object-cover" src={imgSrc} alt={`Product Asset ${index + 1}`} />
                  <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase block mt-3">
                    IMAGE {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-5 right-5 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md cursor-pointer"
                    title="Remove Image"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              ))}
            </div>

            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept=".png, .jpg, .jpeg, .webp"
              className="hidden"
              style={{ display: 'none' }}
            />

            <div 
              onClick={handleDivClick}
              className="add-image flex flex-col items-center text-center gap-2 p-6 border-2 border-dashed border-[#a78bfa4d] rounded-3xl bg-[#8b5cf60d] cursor-pointer hover:bg-[#8b5cf615] transition-all"
            >
              <div className="add-icon text-[#8b5cf6]">
                <i className="fa-regular fa-image text-xl"></i>
              </div>
              <div className="add-title capitalize font-semibold text-slate-700">
                <p>add more images</p>
              </div>
              <div className="add-text text-xs text-slate-400">
                <p>PNG, JPG, WEBP . multiple files supported</p>
              </div>
            </div>

            <div className="senior p-6 rounded-3xl border border-[#e2e8f0] bg-[#10b9810d] flex flex-col gap-4">
              <div className="senior-title flex items-center gap-2 text-[#10b981] font-semibold">
                <i className="fa-regular fa-star"></i>
                <p>Senior UX</p>
              </div>
              <div className="senior-text text-sm text-slate-600">
                <p>Edit without losing the existing product story, while still adding fresh media.</p>
              </div>
            </div>

            <div className="hidden lg:block flex-grow"></div>
          </div>

          {/* Form Fields Section */}
          <form onSubmit={handleSave} className="right-side w-full lg:flex-1 p-6 bg-white shadow-xl rounded-3xl flex flex-col gap-5">
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">Product Name</label>
              <input 
                type="text" 
                name="title"
                value={product.title}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-slate-700 text-sm focus:outline-none focus:border-purple-300 focus:bg-white transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">Short Description</label>
              <input 
                type="text" 
                name="shortDescription"
                value={product.shortDescription}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-slate-700 text-sm focus:outline-none focus:border-purple-300 focus:bg-white transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">Description</label>
              <textarea 
                rows="4"
                name="description"
                value={product.description}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-slate-700 text-sm focus:outline-none focus:border-purple-300 focus:bg-white transition-all resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">Price</label>
                <input 
                  type="number" 
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-slate-700 text-sm focus:outline-none focus:border-purple-300 focus:bg-white transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">Discount Price</label>
                <input 
                  type="number" 
                  name="discountPrice"
                  value={product.discountPrice}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-slate-700 text-sm focus:outline-none focus:border-purple-300 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">Stock</label>
                <input 
                  type="number" 
                  name="stock"
                  value={product.stock}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-slate-700 text-sm focus:outline-none focus:border-purple-300 focus:bg-white transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">SKU</label>
                <input 
                  type="text" 
                  name="sku"
                  value={product.sku}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-slate-700 text-sm focus:outline-none focus:border-purple-300 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">Category</label>
                <select 
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-slate-700 text-sm focus:outline-none focus:border-purple-300 focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="fashion">fashion</option>
                  <option value="electronics">electronics</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">Subcategory</label>
                <select 
                  name="subcategory"
                  value={product.subcategory}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-slate-700 text-sm focus:outline-none focus:border-purple-300 focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="clothes">clothes</option>
                  <option value="shoes">shoes</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">Brand</label>
              <input 
                type="text" 
                name="brand"
                value={product.brand}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-slate-700 text-sm focus:outline-none focus:border-purple-300 focus:bg-white transition-all"
              />
            </div>

            <div className="flex flex-col gap-4 bg-[#f8fafc] rounded-3xl p-6">
              <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">Tags</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault(); 
                      handleAddTag();
                    }
                  }}
                  placeholder="Type a tag and press +" 
                  className="w-full bg-white border border-slate-100 rounded-2xl p-4 text-slate-700 text-sm focus:outline-none focus:border-purple-300 focus:bg-white transition-all"
                />
                <button 
                  type="button" 
                  onClick={handleAddTag}
                  className="bg-[#8b5cf6] text-white px-5 rounded-2xl hover:bg-[#7c3aed] transition-all flex items-center justify-center cursor-pointer"
                >
                  <i className="fa-solid fa-plus text-sm"></i>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {product.tags.length > 0 ? (
                  product.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center gap-2 bg-[#8b5cf615] text-[#7c3aed] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#8b5cf62a]"
                    >
                      {tag}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTag(tag)}
                        className="text-slate-400 hover:text-red-500 transition-colors focus:outline-none font-bold"
                      >
                        <i className="fa-solid fa-xmark text-[10px]"></i>
                      </button>
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">
                    Add one or more tags to organize this product.
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-6 py-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                <input 
                  type="checkbox" 
                  name="featured"
                  checked={product.featured}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[#8b5cf6] rounded-md" 
                />
                Featured
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                <input 
                  type="checkbox" 
                  name="active"
                  checked={product.active}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[#8b5cf6] rounded-md" 
                />
                Active
              </label>
            </div>

            <div className="flex flex-col sm:flex-row justify-start gap-3 mt-2">
              <button 
                type="button" 
                className="w-full sm:w-auto px-6 py-3 cursor-pointer border border-slate-200 text-slate-500 font-medium rounded-2xl text-xs hover:bg-slate-50 transition-all uppercase tracking-wider text-center"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="w-full sm:w-auto px-6 py-3 cursor-pointer bg-[#8b5cf6] text-white font-medium rounded-2xl text-xs hover:bg-[#7c3aed] transition-all uppercase tracking-wider shadow-lg shadow-purple-100 text-center"
              >
                Save Changes
              </button>
            </div>

          </form>

        </div>
      </section>
    </>
  );
}

export default Edit;