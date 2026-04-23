import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../store/authSlice";
import { toggleCart, removeFromCart, clearCart, updateQuantity, addToCart } from "../store/cartSlice";

function Navbar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { isOpen, items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearCart());
    navigate("/login");
  };

  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform duration-300 font-black text-xl">
              R
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900 group-hover:text-primary transition-colors">
              RED<span className="text-primary group-hover:text-slate-900 transition-colors ml-1">APPLE</span>
            </span>
          </Link>

          <div className="hidden md:flex gap-8">
            <Link to="/" className="text-slate-600 font-bold hover:text-primary transition-colors tracking-tight uppercase text-xs">
              Catalogue
            </Link>
            <Link to="/categories" className="text-slate-600 font-bold hover:text-primary transition-colors tracking-tight uppercase text-xs">
              Categories
            </Link>
            {isAuthenticated && user?.role === "admin" && (
              <Link to="/admin" className="text-rose-600 font-black hover:text-rose-800 transition-colors tracking-tight uppercase text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse"></span>
                Admin Panel
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => dispatch(toggleCart())} 
            className="relative p-2 text-slate-700 hover:text-primary transition-colors group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform block">🛒</span>
            {items.length > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                {items.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-3 group">
                <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                  {user?.name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">
                  {user?.name || user?.username}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-slate-900 text-white px-5 py-2.5 rounded-full font-bold text-xs hover:bg-primary transition-all active:scale-95 shadow-md shadow-slate-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors uppercase tracking-tight">
                Log In
              </Link>
              <Link to="/register" className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-xs hover:bg-rose-700 transition-all active:scale-95 shadow-lg shadow-rose-500/20 uppercase tracking-widest">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => dispatch(toggleCart())}></div>
          <div className="relative w-full max-w-sm h-full bg-white shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-300">
            <div className="p-6 flex justify-between items-center bg-slate-50 border-b border-slate-100">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Your Basket</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{items.length} items</p>
              </div>
              <button 
                onClick={() => dispatch(toggleCart())} 
                className="w-10 h-10 rounded-full hover:bg-white hover:shadow-md text-slate-400 hover:text-rose-500 transition-all text-xl font-light"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40 grayscale">
                  <span className="text-6xl mb-4">🛒</span>
                  <p className="font-bold text-slate-600">Your basket is empty</p>
                </div>
              ) : items.map(item => (
                <div key={item.id} className="group flex gap-4 bg-slate-50 p-4 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-rose-500/5 transition-all">
                  <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shadow-sm shrink-0">
                    <img src={item.image ? (item.image.startsWith('http') ? item.image : `http://localhost:3001${item.image}`) : "https://placehold.co/400x500"} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors text-sm line-clamp-1">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-2">
                        <button 
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                          className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-black hover:border-primary hover:text-primary transition-all"
                        >
                          -
                        </button>
                        <span className="text-xs font-black text-slate-900 w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => dispatch(addToCart(item))}
                          className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-black hover:border-primary hover:text-primary transition-all"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-black text-rose-600">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={() => dispatch(removeFromCart({ id: item.id }))} 
                    className="self-start text-slate-300 hover:text-rose-500 transition-colors p-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50 rounded-t-3xl shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Total Amount</span>
                <span className="text-3xl font-black text-rose-600">${cartTotal.toFixed(2)}</span>
              </div>
              <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black tracking-widest hover:bg-primary transition-all active:scale-95 shadow-xl shadow-slate-200 uppercase text-sm">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
