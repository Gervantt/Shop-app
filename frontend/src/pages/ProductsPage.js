import React, { useState, useEffect } from "react";
import "./ProductsPage.css";

const API = "http://localhost:5000/api";

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

  // Загружаем продукты и категории при монтировании
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch(`${API}/products`);
    setProducts(await res.json());
  };

  const fetchCategories = async () => {
    const res = await fetch(`${API}/categories`);
    setCategories(await res.json());
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
    if (editingId) {
      // UPDATE — PUT запрос
      await fetch(`${API}/products/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setEditingId(null);
    } else {
      // CREATE — POST запрос
      await fetch(`${API}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm({ name: "", price: "", categoryId: "", description: "" });
    fetchProducts();
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
    await fetch(`${API}/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  return (
    <div className="products-page">
      <h1>Products</h1>

      {/* Форма создания/редактирования */}
      <form className="product-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Product name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          required
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
        />
        <button type="submit">{editingId ? "Update" : "Add"}</button>
        {editingId && (
          <button
            type="button"
            className="cancel-btn"
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
      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>${p.price}</td>
              <td>{getCategoryName(p.categoryId)}</td>
              <td>{p.description}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(p)}>
                  Edit
                </button>
                <button
                  className="delete-btn"
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
