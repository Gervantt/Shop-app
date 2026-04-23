import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Notification from "./components/Notification";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductsPage from "./pages/ProductsPage";
import CategoriesPage from "./pages/CategoriesPage";
import UsersPage from "./pages/UsersPage";
import ProfilePage from "./pages/ProfilePage";
import ProductDetailPage from "./pages/ProductDetailPage";

import AdminLayout from "./layouts/AdminLayout";
import AdminPanel from "./pages/admin/AdminPanel";
import AdminProductsList from "./pages/admin/AdminProductsList";
import AdminProductsFormPage from "./pages/admin/AdminProductsFormPage";
import AdminCategoriesList from "./pages/admin/AdminCategoriesList";
import AdminCategoriesFormPage from "./pages/admin/AdminCategoriesFormPage";
import AdminUsersList from "./pages/admin/AdminUsersList";

import "./styles/global.css";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  const ProtectedAdminRoute = ({ element }) => {
    if (!isAuthenticated || user?.role !== 'admin') {
      return <Navigate to="/" />;
    }
    return <AdminLayout>{element}</AdminLayout>;
  };

  return (
    <div className="app min-h-screen flex flex-col">
      <Notification />
      {!isAdminPath && <Navbar />}

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />

          <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
          
          <Route path="/admin" element={<ProtectedAdminRoute element={<AdminPanel />} />} />
          <Route path="/admin/products" element={<ProtectedAdminRoute element={<AdminProductsList />} />} />
          <Route path="/admin/products/add" element={<ProtectedAdminRoute element={<AdminProductsFormPage />} />} />
          <Route path="/admin/products/edit/:id" element={<ProtectedAdminRoute element={<AdminProductsFormPage />} />} />
          <Route path="/admin/categories" element={<ProtectedAdminRoute element={<AdminCategoriesList />} />} />
          <Route path="/admin/categories/add" element={<ProtectedAdminRoute element={<AdminCategoriesFormPage />} />} />
          <Route path="/admin/categories/edit/:id" element={<ProtectedAdminRoute element={<AdminCategoriesFormPage />} />} />
          <Route path="/admin/users" element={<ProtectedAdminRoute element={<AdminUsersList />} />} />
          
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/users" element={isAuthenticated && user?.role === 'admin' ? <UsersPage /> : <Navigate to="/login" />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      {!isAdminPath && <Footer />}
    </div>
  );
}

export default App;
