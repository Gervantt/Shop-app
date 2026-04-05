import React, { useState, useEffect } from "react";
import "./UsersPage.css";

const API = "http://localhost:3001/api";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", role: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  // Read all
  const fetchUsers = async () => {
    const res = await fetch(`${API}/users`);
    setUsers(await res.json());
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Нажатие Edit — заполняем форму
  const handleEdit = (user) => {
    setEditingId(user.id);
    setForm({ name: user.name, email: user.email, role: user.role });
  };

  // Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    await fetch(`${API}/users/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setEditingId(null);
    setForm({ name: "", email: "", role: "" });
    fetchUsers();
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await fetch(`${API}/users/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  // Read one by ID
  const handleViewOne = async (id) => {
    const res = await fetch(`${API}/users/${id}`);
    const user = await res.json();
    alert(
      `User #${user.id}\nName: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}`
    );
  };

  return (
    <div className="users-page">
      <h1>Users</h1>

      {/* Форма редактирования (появляется при нажатии Edit) */}
      {editingId && (
        <form className="user-edit-form" onSubmit={handleUpdate}>
          <h3>Edit User #{editingId}</h3>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
          <div className="user-edit-actions">
            <button type="submit">Save</button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setEditingId(null);
                setForm({ name: "", email: "", role: "" });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <span className={`role-badge role-${u.role}`}>{u.role}</span>
              </td>
              <td>
                <button
                  className="view-btn"
                  onClick={() => handleViewOne(u.id)}
                >
                  View
                </button>
                <button className="edit-btn" onClick={() => handleEdit(u)}>
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(u.id)}
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

export default UsersPage;
