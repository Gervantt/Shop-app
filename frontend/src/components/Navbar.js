import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Shop App</div>
      <div className="navbar-links">
        <Link to="/products">Products</Link>
        <Link to="/categories">Categories</Link>
          {user?.role === "admin" && <Link to="/users">Users</Link>}
      </div>
      <div className="navbar-user">
        <span>Hi, {user?.name}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
