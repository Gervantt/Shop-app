import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productsAPI, categoriesAPI, IMAGE_BASE } from '../api/apiClient';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { showNotification } from '../store/notificationSlice';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const productData = await productsAPI.getById(id);

      if (!productData) {
        dispatch(showNotification({ message: 'Product not found', type: 'error' }));
        navigate('/');
        return;
      }

      setProduct(productData);

      if (productData.categoryId) {
        const categories = await categoriesAPI.getAll();
        const foundCategory = categories.find(c => c.id == productData.categoryId);
        setCategory(foundCategory);
      }
    } catch (error) {
      dispatch(showNotification({ message: 'Failed to load product', type: 'error' }));
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const [qty, setQty] = useState(1);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity: qty }));
    dispatch(showNotification({ message: `${qty}x "${product.name}" added to cart`, type: 'success' }));
  };

  const incrementQty = () => setQty(prev => prev + 1);
  const decrementQty = () => setQty(prev => Math.max(1, prev - 1));

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-20 px-8 animate-pulse">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/2 aspect-square bg-slate-100 rounded-[3rem]"></div>
          <div className="lg:w-1/2 space-y-8">
            <div className="h-4 bg-slate-100 rounded-full w-1/4"></div>
            <div className="h-12 bg-slate-100 rounded-full w-3/4"></div>
            <div className="h-8 bg-slate-100 rounded-full w-1/4"></div>
            <div className="space-y-4 pt-8">
              <div className="h-4 bg-slate-100 rounded-full w-full"></div>
              <div className="h-4 bg-slate-100 rounded-full w-full"></div>
              <div className="h-4 bg-slate-100 rounded-full w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto py-12 lg:py-20 px-8 lg:px-12">
      <nav className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-400 mb-12">
        <Link to="/" className="hover:text-primary transition-colors">Catalog</Link>
        <span>/</span>
        {category && (
          <>
            <Link to={`/categories`} className="hover:text-primary transition-colors">{category.name}</Link>
            <span>/</span>
          </>
        )}
        <span className="text-slate-900">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
        {/* Image Section */}
        <div className="lg:w-1/2">
          <div className="sticky top-32 group">
            <div className="relative aspect-square overflow-hidden rounded-[3rem] bg-slate-50 shadow-2xl shadow-slate-200">
              <img
                src={product.image ? (product.image.startsWith('http') ? product.image : `${IMAGE_BASE}${product.image}`) : 'https://placehold.co/800'}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="lg:w-1/2 flex flex-col pt-4">
          <div className="mb-10 pb-10 border-b border-slate-100">
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-8">
              {product.name}
            </h1>
            
            <div className="flex items-baseline gap-6 mt-4">
              <span className="text-5xl font-black text-rose-600 tracking-tighter">
                ${product.price}
              </span>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  {product.stock > 0 ? `${product.stock} available in stock` : 'Sold out'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-10 py-6">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4">Description</h3>
              <p className="text-slate-500 text-lg leading-relaxed font-medium">
                {product.description || 'Experience the perfect blend of innovation and elegance. This premium product is meticulously crafted to meet the highest standards of quality and style, ensuring a transformative experience for discerning individuals.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 py-8 px-8 bg-slate-50 rounded-3xl border border-slate-100">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Authenticity</h4>
                <p className="text-sm font-bold text-slate-800 tracking-tight">100% Original</p>
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Shipping</h4>
                <p className="text-sm font-bold text-slate-800 tracking-tight">Free over $500</p>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-12 flex flex-col sm:flex-row gap-6">
            <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl p-2 h-[72px]">
              <button 
                onClick={decrementQty}
                className="w-12 h-full rounded-xl bg-white text-slate-400 hover:text-primary hover:shadow-md transition-all font-light text-xl flex items-center justify-center cursor-pointer"
              >
                −
              </button>
              <div className="w-16 text-center font-black text-slate-800 text-lg">
                {qty}
              </div>
              <button 
                onClick={incrementQty}
                className="w-12 h-full rounded-xl bg-white text-slate-400 hover:text-primary hover:shadow-md transition-all font-light text-xl flex items-center justify-center cursor-pointer"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="flex-1 bg-slate-900 text-white py-6 rounded-2xl font-black tracking-widest uppercase text-sm hover:bg-primary transition-all active:scale-[0.98] shadow-2xl shadow-slate-200 disabled:opacity-50 disabled:grayscale cursor-pointer group"
            >
              Add to Basket <span className="inline-block group-hover:translate-x-1 transition-transform ml-2">→</span>
            </button>
          </div>
          
          <p className="mt-8 text-center sm:text-left text-[10px] font-black uppercase tracking-widest text-slate-300">
            Complimentary samples included with every order.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
