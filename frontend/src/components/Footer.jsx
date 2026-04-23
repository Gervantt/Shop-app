import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10 mt-20">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-slate-800 pb-16 mb-10">
        <div className="flex flex-col gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black text-sm shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform duration-300">
              R
            </div>
            <span className="text-xl font-black tracking-tighter text-white">
              RED<span className="text-primary ml-1">APPLE</span>
            </span>
          </Link>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            Your destination for premium products and exceptional service. Experience the Red Apple lifestyle.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-black uppercase tracking-widest text-slate-500">Catalogue</h4>
          <ul className="flex flex-col gap-3 text-sm font-bold text-slate-300">
            <li><Link to="/" className="hover:text-primary transition-colors">All Products</Link></li>
            <li><Link to="/categories" className="hover:text-primary transition-colors">Categories</Link></li>
            <li><span className="text-slate-600">New Arrivals</span></li>
            <li><span className="text-slate-600">Best Sellers</span></li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-black uppercase tracking-widest text-slate-500">Account</h4>
          <ul className="flex flex-col gap-3 text-sm font-bold text-slate-300">
            <li><Link to="/profile" className="hover:text-primary transition-colors">Profile</Link></li>
            <li><Link to="/login" className="hover:text-primary transition-colors">Login</Link></li>
            <li><Link to="/register" className="hover:text-primary transition-colors">Register</Link></li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-black uppercase tracking-widest text-slate-500">Contact</h4>
          <ul className="flex flex-col gap-3 text-sm font-bold text-slate-300">
            <li className="flex items-center gap-2">
              <span className="text-slate-600">@</span> hello@redapple.com
            </li>
            <li className="flex items-center gap-2">
              <span className="text-slate-600">t</span> +1 (555) 123-4567
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
          &copy; 2026 Red Apple Shop. All rights reserved.
        </p>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-600">
          <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms of Service</span>
          <span className="hover:text-slate-400 cursor-pointer transition-colors">Cookies</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
