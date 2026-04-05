import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { categoriesAPI, productsAPI } from "../api/apiClient";

function CategoriesPage() {
  const { user: currentUser } = useContext(AuthContext);
  const isAdmin = currentUser?.role === "admin";

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  // Для отображения продуктов выбранной категории (one-to-many)
  const [selectedCatId, setSelectedCatId] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const categories = await categoriesAPI.getAll();
      setCategories(categories);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const products = await productsAPI.getAll();
      setProducts(products);
    } finally {
      // Не скрываем loading
    }
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
        await categoriesAPI.update(editingId, form, currentUser.id);
        setEditingId(null);
      } else {
        await categoriesAPI.create(form, currentUser.id);
      }
      setForm({ name: "", description: "" });
      await fetchCategories();
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, description: cat.description });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category and all its products?")) return;
    try {
      setLoading(true);
      await categoriesAPI.delete(id, currentUser.id);
      await fetchCategories();
      await fetchProducts(); // обновляем, т.к. каскадное удаление
      if (selectedCatId === id) setSelectedCatId(null);
    } finally {
      setLoading(false);
    }
  };

  // Фильтруем продукты по выбранной категории
  const filteredProducts = selectedCatId
    ? products.filter((p) => p.categoryId === selectedCatId)
    : [];

  return (
    <div className="max-w-3xl mx-auto my-8 px-5">
      <h1 className="mb-5 text-[#1a1a2e] text-3xl font-bold">Categories</h1>

      {isAdmin && (
        <form className="flex gap-2 mb-6 flex-wrap" onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Category name"
            value={form.name}
            onChange={handleChange}
            required
            className="flex-1 min-w-40 px-3 py-2 border border-gray-300 rounded text-sm"
          />
          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="flex-1 min-w-40 px-3 py-2 border border-gray-300 rounded text-sm"
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
                setForm({ name: "", description: "" });
              }}
            >
              Cancel
            </button>
          )}
        </form>
      )}

      <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
        <thead>
          <tr className="bg-[#1a1a2e] text-white">
            <th className="p-3 text-left border-b text-sm">ID</th>
            <th className="p-3 text-left border-b text-sm">Name</th>
            <th className="p-3 text-left border-b text-sm">Description</th>
            <th className="p-3 text-left border-b text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan="4" className="p-3 text-center text-gray-600">
                Loading categories...
              </td>
            </tr>
          )}
          {categories.map((cat) => (
            <tr key={cat.id} className="border-b">
              <td className="p-3 text-sm">{cat.id}</td>
              <td className="p-3 text-sm">{cat.name}</td>
              <td className="p-3 text-sm">{cat.description}</td>
              <td className="p-3 text-sm space-x-1">
                {isAdmin && (
                  <button 
                    disabled={loading}
                    className={`px-3 py-1 rounded text-xs cursor-pointer transition-colors ${
                      loading
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        : 'bg-[#0f3460] text-white hover:bg-[#0a2647]'
                    }`}
                    onClick={() => handleEdit(cat)}
                  >
                    Edit
                  </button>
                )}
                {isAdmin && (
                  <button
                    disabled={loading}
                    className={`px-3 py-1 rounded text-xs cursor-pointer transition-colors ${
                      loading
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        : 'bg-[#e94560] text-white hover:bg-[#c73652]'
                    }`}
                    onClick={() => handleDelete(cat.id)}
                  >
                    Delete
                  </button>
                )}
                <button
                  className="bg-[#533483] text-white px-3 py-1 rounded text-xs cursor-pointer hover:bg-[#3d2463] transition-colors"
                  onClick={() =>
                    setSelectedCatId(
                      selectedCatId === cat.id ? null : cat.id
                    )
                  }
                >
                  {selectedCatId === cat.id ? "Hide" : "Products"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* One-to-many: показываем продукты выбранной категории */}
      {selectedCatId && (
        <div className="mt-8 bg-white p-5 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-[#1a1a2e] mb-3">
            Products in &quot;
            {categories.find((c) => c.id === selectedCatId)?.name}&quot;
          </h3>
          {filteredProducts.length === 0 ? (
            <p className="text-gray-600">No products in this category.</p>
          ) : (
            <ul className="space-y-2">
              {filteredProducts.map((p) => (
                <li key={p.id} className="text-sm text-gray-700">
                  {p.name} — ${p.price}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default CategoriesPage;
