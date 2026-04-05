import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between bg-[#1a1a2e] text-white px-6 py-3">
      <div className="text-xl font-bold">Shop App</div>
      <div className="flex gap-5">
        <Link to="/products" className="text-gray-400 text-sm hover:text-white transition-colors">
          Products
        </Link>
        <Link to="/categories" className="text-gray-400 text-sm hover:text-white transition-colors">
          Categories
        </Link>
        {user?.role === "admin" && (
          <Link to="/users" className="text-gray-400 text-sm hover:text-white transition-colors">
            Users
          </Link>
        )}
      </div>
      <div className="flex items-center gap-3 text-sm">
        <span>Hi, {user?.name}</span>
        <button
          onClick={handleLogout}
          className="bg-[#e94560] text-white px-3 py-1 rounded cursor-pointer text-xs hover:bg-[#c73652] transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
