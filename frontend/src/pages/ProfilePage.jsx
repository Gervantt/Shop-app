import React from 'react';
import { useSelector } from 'react-redux';

const ProfilePage = () => {
  const { user } = useSelector(state => state.auth);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto py-20 px-8">
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-rose-500/5 overflow-hidden">
        <div className="bg-slate-900 h-48 relative">
          <div className="absolute -bottom-16 left-12">
            <div className="w-32 h-32 bg-primary rounded-[2rem] border-8 border-white shadow-xl flex items-center justify-center text-white text-5xl font-black">
              {user.name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>
        
        <div className="pt-24 pb-16 px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">
                {user.name || user.username}
              </h1>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] ml-1">
                Member of Red Apple Collective
              </p>
            </div>
            <button className="px-8 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs uppercase tracking-widest text-slate-600 hover:bg-white hover:border-primary hover:text-primary transition-all active:scale-95">
              Edit Settings
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-slate-50">
            <div className="space-y-8">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Primary Email</h3>
                <div className="flex items-center gap-4">
                  <span className="text-2xl">✉️</span>
                  <p className="text-lg font-bold text-slate-800 tracking-tight">{user.email}</p>
                </div>
              </div>
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Account Role</h3>
                <div className="flex items-center gap-4">
                  <span className="text-2xl">🛡️</span>
                  <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                    user.role === 'admin' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
              <h3 className="text-sm font-black text-slate-900 mb-4">Membership Perks</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm font-medium text-slate-500">
                  <span className="text-primary">✓</span> Free shipping on all luxury orders
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-slate-500">
                  <span className="text-primary">✓</span> Early access to fresh arrivals
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-slate-500">
                  <span className="text-primary">✓</span> 10% cash-back in Apple Points
                </li>
              </ul>
              <button className="mt-8 w-full py-4 bg-white border border-slate-200 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-400 cursor-not-allowed">
                Upgrade to Platinum
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
