import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import AdminHeader from '../components/AdminHeader';

const AdminLayout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <aside className="w-64 bg-slate-800 text-slate-100 py-6 sticky top-16 h-[calc(100vh-64px)] shadow-xl z-40 hidden md:block">
          <div className="px-6 pb-6 border-b border-slate-700 mb-6">
            <h2 className="text-xl font-bold text-blue-400">Admin Panel</h2>
          </div>
          <nav className="flex flex-col gap-1 px-3">
            <Link
              to="/admin"
              className={`px-4 py-3 rounded-lg transition-all flex items-center font-medium ${
                isActive('/admin') 
                ? 'bg-blue-600 text-white' 
                : 'hover:bg-slate-700 hover:text-white'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/admin/products"
              className={`px-4 py-3 rounded-lg transition-all flex items-center font-medium ${
                isActive('/admin/products') 
                ? 'bg-blue-600 text-white' 
                : 'hover:bg-slate-700 hover:text-white'
              }`}
            >
              Products
            </Link>
            <Link
              to="/admin/categories"
              className={`px-4 py-3 rounded-lg transition-all flex items-center font-medium ${
                isActive('/admin/categories') 
                ? 'bg-blue-600 text-white' 
                : 'hover:bg-slate-700 hover:text-white'
              }`}
            >
              Categories
            </Link>
            <Link
              to="/admin/users"
              className={`px-4 py-3 rounded-lg transition-all flex items-center font-medium ${
                isActive('/admin/users') 
                ? 'bg-blue-600 text-white' 
                : 'hover:bg-slate-700 hover:text-white'
              }`}
            >
              Users
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-8 bg-slate-50 min-h-full">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
