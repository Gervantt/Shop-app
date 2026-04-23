import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../../api/apiClient';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [products, categories] = await Promise.all([
        productsAPI.getAll(),
        categoriesAPI.getAll(),
      ]);
      setStats({
        products: products.length || 0,
        categories: categories.length || 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Dashboard</h1>
        <p className="text-slate-500 font-medium mt-2 text-lg">Welcome to your Admin Panel</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 text-xl font-medium animate-pulse">Loading overview...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 group hover:border-blue-200 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">📦</div>
              <Link to="/admin/products" className="text-blue-600 font-bold hover:underline">Manage →</Link>
            </div>
            <div className="flex flex-col">
              <span className="text-5xl font-black text-slate-800">{stats.products}</span>
              <span className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Total Products</span>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 group hover:border-blue-200 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">🏷️</div>
              <Link to="/admin/categories" className="text-blue-600 font-bold hover:underline">Manage →</Link>
            </div>
            <div className="flex flex-col">
              <span className="text-5xl font-black text-slate-800">{stats.categories}</span>
              <span className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Total Categories</span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-800 rounded-3xl p-10 text-white shadow-2xl shadow-blue-900/20">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm">⚡</span>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link to="/admin/products/add" className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600 p-6 rounded-2xl transition-all flex items-center justify-between group">
            <span className="font-bold text-lg">Add New Product</span>
            <span className="text-2xl group-hover:translate-x-1 transition-transform">➕</span>
          </Link>
          <Link to="/admin/categories/add" className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600 p-6 rounded-2xl transition-all flex items-center justify-between group">
            <span className="font-bold text-lg">Add New Category</span>
            <span className="text-2xl group-hover:translate-x-1 transition-transform">➕</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
