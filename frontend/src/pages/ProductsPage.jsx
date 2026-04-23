import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { productsAPI, categoriesAPI } from "../api/apiClient";
import { addToCart } from "../store/cartSlice";
import { showNotification } from "../store/notificationSlice";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        productsAPI.getAll(),
        categoriesAPI.getAll()
      ]);
      setProducts(prodRes || []);
      setCategories(catRes || []);
    } catch (err) {
      dispatch(showNotification({ message: "Failed to load data", type: "error" }));
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    dispatch(showNotification({ message: `"${product.name}" added to cart`, type: "success" }));
  };

  const filteredProducts = selectedCategory
    ? products.filter(p => String(p.categoryId) === String(selectedCategory))
    : products;

  return (
    <div className="max-w-7xl mx-auto py-12 px-8">
      <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-rose-100">
            <span className="w-1 h-1 bg-rose-600 rounded-full animate-ping"></span>
            Fresh Arrivals
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none mb-6">
            Signature <span className="text-primary italic">Collection</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg leading-relaxed">
            Discover our collection of hand-picked products designed for your lifestyle. 
            Quality meets aesthetic in every single detail.
          </p>
        </div>

        <div className="flex flex-col gap-3 min-w-[240px]">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Filter by Collection</label>
          <div className="relative group">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 p-4 pr-12 rounded-2xl font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-rose-100 focus:border-rose-500 transition-all cursor-pointer shadow-sm group-hover:bg-white"
            >
              <option value="">All Collections</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-primary transition-colors">
              ▼
            </div>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="animate-pulse flex flex-col gap-4">
              <div className="aspect-[4/5] bg-slate-100 rounded-3xl"></div>
              <div className="h-4 bg-slate-100 rounded-full w-2/3"></div>
              <div className="h-4 bg-slate-100 rounded-full w-1/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {filteredProducts.map(product => (
            <div key={product.id} className="group relative flex flex-col gap-5">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-slate-100 shadow-xl shadow-slate-200/50">
                <Link to={`/products/${product.id}`} className="block w-full h-full">
                  <img 
                    src={product.image ? (product.image.startsWith('http') ? product.image : `http://localhost:3001${product.image}`) : "https://placehold.co/400x500"} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                
                <button
                  onClick={() => handleAddToCart(product)}
                  className="absolute bottom-6 right-6 w-14 h-14 bg-white text-slate-900 rounded-2xl flex items-center justify-center text-xl shadow-2xl translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hover:bg-primary hover:text-white active:scale-95 cursor-pointer"
                  title="Add to Cart"
                >
                  🛒
                </button>
              </div>

              <div className="px-2">
                <div className="flex justify-between items-start mb-2 gap-4">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-tight group-hover:text-primary transition-colors">
                    <Link to={`/products/${product.id}`}>{product.name}</Link>
                  </h2>
                  <span className="text-xl font-black text-rose-600">${product.price}</span>
                </div>
                <p className="text-slate-400 text-sm font-medium line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-40 flex flex-col items-center text-center">
              <div className="text-8xl mb-8 opacity-20 filter grayscale">🍎</div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Nothing found in this collection</h3>
              <p className="text-slate-400 font-medium max-w-sm">Try selecting a different category or wait for our upcoming fresh arrivals.</p>
              <button 
                onClick={() => setSelectedCategory("")}
                className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-rose-600 transition-all active:scale-95"
              >
                Show All Products
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductsPage;
