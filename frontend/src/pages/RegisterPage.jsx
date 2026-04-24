import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authAPI } from "../api/apiClient";
import { loginUser } from "../store/authSlice";
import { showNotification } from "../store/notificationSlice";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await authAPI.register(name, email, password);
      
      dispatch(loginUser({ user: data.user, token: data.token }));
      dispatch(showNotification({ message: "Account created successfully", type: "success" }));
      navigate("/");
    } catch (err) {
      dispatch(showNotification({ message: err.message, type: "error" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden px-6 py-20">
      {/* Decorative background elements */}
      <div className="absolute bottom-0 left-0 w-1/2 h-screen bg-rose-50/50 skew-x-12 -translate-x-1/4"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-100/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-200/20 rounded-full blur-3xl"></div>

      <div className="relative w-full max-w-xl bg-white/70 backdrop-blur-2xl p-12 lg:p-20 rounded-[3rem] shadow-2xl shadow-rose-500/10 border border-white/50">
        <div className="flex flex-col items-center mb-12">
          <Link to="/" className="flex items-center gap-2 group mb-8">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform duration-300">
              R
            </div>
            <span className="text-3xl font-black tracking-tighter text-slate-900 leading-none">
              RED<span className="text-primary ml-1 uppercase">Apple</span>
            </span>
          </Link>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight text-center">Join the Club</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Experience premium shopping today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Alexander Red"
              required
              className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-rose-100 focus:border-rose-500 transition-all shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., alex@example.com"
              required
              className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-rose-100 focus:border-rose-500 transition-all shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Secure Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-rose-100 focus:border-rose-500 transition-all shadow-sm"
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black tracking-widest uppercase text-sm hover:bg-primary transition-all active:scale-[0.98] shadow-2xl shadow-slate-200 disabled:opacity-50 disabled:grayscale cursor-pointer"
            >
              {loading ? "Creating Account..." : "Create My Account"}
            </button>
          </div>
        </form>

        <div className="mt-12 text-center">
          <p className="text-slate-400 font-medium">
            Already have an account? <Link to="/login" className="text-primary font-black hover:underline ml-1 tracking-tight">Sign in instead</Link>
          </p>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-100 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 leading-relaxed">
            By joining, you agree to our Terms of Boutique and Privacy Policy.<br/>
            Welcome to the Red Apple family.
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
