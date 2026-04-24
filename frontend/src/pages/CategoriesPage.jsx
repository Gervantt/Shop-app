import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { categoriesAPI, productsAPI, IMAGE_BASE } from "../api/apiClient";

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCatId, setSelectedCatId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, prodRes] = await Promise.all([
        categoriesAPI.getAll(),
        productsAPI.getAll()
      ]);
      setCategories(catRes || []);
      setProducts(prodRes || []);
    } finally {
      setLoading(false);
    }
  };

  const getProductCount = (catId) => {
    return products.filter(p => p.categoryId === catId).length;
  };

  const getCategoryProducts = (catId) => {
    return products.filter(p => p.categoryId === catId).slice(0, 4);
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-8">
      <header className="mb-20 text-center">
        <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-6">
          The <span className="text-primary italic">Collections</span>
        </h1>
        <p className="text-slate-400 font-medium text-lg max-w-2xl mx-auto">
          Explore our range of premium products organized by collection. 
          Every category is a unique experience.
        </p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="animate-pulse bg-slate-50 h-80 rounded-[3rem]"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {categories.map(cat => (
            <div key={cat.id} className="group flex flex-col gap-8 bg-white border border-slate-100 p-8 rounded-[3rem] hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-500">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 group-hover:text-primary transition-colors tracking-tight mb-2">
                    {cat.name}
                  </h2>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                    {getProductCount(cat.id)} Products
                  </p>
                </div>
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  🏷️
                </div>
              </div>

              <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-3 min-h-[4.5rem]">
                {cat.description || "Discover our exclusive " + cat.name + " collection, featuring premium quality items selected just for you."}
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-2">
                  {getCategoryProducts(cat.id).map(p => (
                    <div key={p.id} className="aspect-square bg-slate-50 rounded-xl overflow-hidden border border-slate-100 shadow-sm group-hover:shadow-md transition-all">
                      <img src={p.image ? (p.image.startsWith('http') ? p.image : `${IMAGE_BASE}${p.image}`) : "https://placehold.co/400x500"} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {[...Array(Math.max(0, 4 - getCategoryProducts(cat.id).length))].map((_, i) => (
                    <div key={i} className="aspect-square bg-slate-50 rounded-xl flex items-center justify-center text-slate-200 border border-slate-100 border-dashed">
                      ·
                    </div>
                  ))}
                </div>
                
                <Link 
                  to={`/`}
                  className="block w-full text-center py-4 bg-slate-900 text-white rounded-2xl font-black tracking-widest uppercase text-[10px] hover:bg-primary transition-all active:scale-[0.98]"
                >
                  View Collection
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoriesPage;
