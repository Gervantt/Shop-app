import React, { useState, useEffect } from "react";
import { productsAPI, categoriesAPI } from "../api/apiClient";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    categoryId: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Загружаем продукты и категории при монтировании
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const products = await productsAPI.getAll();
      setProducts(products);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categories = await categoriesAPI.getAll();
      setCategories(categories);
    } finally {
      // Не скрываем loading, т.к. он уже скрыт в fetchProducts
    }
  };

  // Получаем название категории по ID
  const getCategoryName = (catId) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.name : "Unknown";
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create или Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingId) {
        await productsAPI.update(editingId, form);
        setEditingId(null);
      } else {
        await productsAPI.create(form);
      }
      setForm({ name: "", price: "", categoryId: "", description: "" });
      await fetchProducts();
    } finally {
      setLoading(false);
    }
  };

  // Нажатие Edit — заполняем форму данными продукта
  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      categoryId: product.categoryId,
      description: product.description,
    });
  };

  // DELETE запрос
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      setLoading(true);
      await productsAPI.delete(id);
      await fetchProducts();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 px-5">
      <h1 className="mb-5 text-[#1a1a2e] text-3xl font-bold">Products</h1>

      {/* Форма создания/редактирования */}
      <form className="flex gap-2 mb-6 flex-wrap" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Product name"
          value={form.name}
          onChange={handleChange}
          required
          className="px-3 py-2 border border-gray-300 rounded text-sm"
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          className="px-3 py-2 border border-gray-300 rounded text-sm"
        />
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          required
          className="px-3 py-2 border border-gray-300 rounded text-sm"
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="px-3 py-2 border border-gray-300 rounded text-sm"
        />
        <button 
          type="submit" 
          disabled={loading}
          className={`px-5 py-2 rounded cursor-pointer text-sm transition-colors ${
            loading 
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
              : 'bg-[#0f3460] text-white hover:bg-[#0a2647]'
          }`}
        >
          {loading ? "Loading..." : (editingId ? "Update" : "Add")}
        </button>
        {editingId && (
          <button
            type="button"
            disabled={loading}
            className={`px-5 py-2 rounded cursor-pointer text-sm transition-colors ${
              loading
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-gray-500 text-white hover:bg-gray-600'
            }`}
            onClick={() => {
              setEditingId(null);
              setForm({ name: "", price: "", categoryId: "", description: "" });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Таблица продуктов */}
      <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
        <thead>
          <tr className="bg-[#1a1a2e] text-white">
            <th className="p-3 text-left border-b text-sm">ID</th>
            <th className="p-3 text-left border-b text-sm">Name</th>
            <th className="p-3 text-left border-b text-sm">Price</th>
            <th className="p-3 text-left border-b text-sm">Category</th>
            <th className="p-3 text-left border-b text-sm">Description</th>
            <th className="p-3 text-left border-b text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan="6" className="p-3 text-center text-gray-600">
                Loading products...
              </td>
            </tr>
          )}
          {products.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="p-3 text-sm">{p.id}</td>
              <td className="p-3 text-sm">{p.name}</td>
              <td className="p-3 text-sm">${p.price}</td>
              <td className="p-3 text-sm">{getCategoryName(p.categoryId)}</td>
              <td className="p-3 text-sm">{p.description}</td>
              <td className="p-3 text-sm">
                <button 
                  disabled={loading}
                  className={`px-3 py-1 rounded text-xs cursor-pointer mr-1 transition-colors ${
                    loading
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-[#0f3460] text-white hover:bg-[#0a2647]'
                  }`}
                  onClick={() => handleEdit(p)}
                >
                  Edit
                </button>
                <button
                  disabled={loading}
                  className={`px-3 py-1 rounded text-xs cursor-pointer transition-colors ${
                    loading
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-[#e94560] text-white hover:bg-[#c73652]'
                  }`}
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductsPage;
