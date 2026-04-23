import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/authSlice';

const AdminHeader = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link to="/" className="group flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-xs transition-transform group-hover:scale-110">
            ←
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">
            Exit to Store
          </span>
        </Link>
        <div className="h-8 w-px bg-slate-100 mx-2"></div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
          <span className="text-lg font-black tracking-tight text-slate-900">
            ADMIN<span className="text-primary italic ml-1 underline decoration-rose-200">PORTAL</span>
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-10">
        <div className="hidden sm:flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs font-black text-slate-900 tracking-tight leading-none mb-1">{user?.name || 'Administrator'}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Controller</p>
          </div>
          <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 font-black border border-rose-100">
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
        </div>
        <button 
          onClick={handleLogout} 
          className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-primary transition-all active:scale-95 shadow-lg shadow-slate-200"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
