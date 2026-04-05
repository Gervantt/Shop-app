import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductsPage from "./pages/ProductsPage";
import CategoriesPage from "./pages/CategoriesPage";
import UsersPage from "./pages/UsersPage";
import "./styles/global.css";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <div className="app min-h-screen flex flex-col">
      {/* Navbar показываем только если пользователь залогинен */}
      {user && <Navbar />}

      <div className="flex-1">
      <Routes>
        {/* Публичные маршруты */}
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to="/products" />}
        />
        <Route
          path="/register"
          element={!user ? <RegisterPage /> : <Navigate to="/products" />}
        />

        {/* Защищённые маршруты — если не залогинен, редирект на /login */}
        <Route
          path="/products"
          element={user ? <ProductsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/categories"
          element={user ? <CategoriesPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/users"
          element={user ? <UsersPage /> : <Navigate to="/login" />}
        />

        {/* По умолчанию */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      </div>
      {user && <Footer />}
    </div>
  );
}

export default App;
