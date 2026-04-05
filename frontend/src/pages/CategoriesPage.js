import React, { useState, useEffect } from "react";
import "./CategoriesPage.css";

const API = "http://localhost:5000/api";

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  // Для отображения продуктов выбранной категории (one-to-many)
  const [selectedCatId, setSelectedCatId] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch(`${API}/categories`);
    setCategories(await res.json());
  };

  const fetchProducts = async () => {
    const res = await fetch(`${API}/products`);
    setProducts(await res.json());
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create или Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`${API}/categories/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setEditingId(null);
    } else {
      await fetch(`${API}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm({ name: "", description: "" });
    fetchCategories();
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, description: cat.description });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category and all its products?")) return;
    await fetch(`${API}/categories/${id}`, { method: "DELETE" });
    fetchCategories();
    fetchProducts(); // обновляем, т.к. каскадное удаление
    if (selectedCatId === id) setSelectedCatId(null);
  };

  // Фильтруем продукты по выбранной категории
  const filteredProducts = selectedCatId
    ? products.filter((p) => p.categoryId === selectedCatId)
    : [];

  return (
    <div className="categories-page">
      <h1>Categories</h1>

      <form className="category-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Category name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <button type="submit">{editingId ? "Update" : "Add"}</button>
        {editingId && (
          <button
            type="button"
            className="cancel-btn"
            onClick={() => {
              setEditingId(null);
              setForm({ name: "", description: "" });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <table className="category-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>{cat.name}</td>
              <td>{cat.description}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(cat)}>
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(cat.id)}
                >
                  Delete
                </button>
                <button
                  className="view-btn"
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
        <div className="category-products">
          <h3>
            Products in &quot;
            {categories.find((c) => c.id === selectedCatId)?.name}&quot;
          </h3>
          {filteredProducts.length === 0 ? (
            <p>No products in this category.</p>
          ) : (
            <ul>
              {filteredProducts.map((p) => (
                <li key={p.id}>
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
