import React, { useState, useEffect } from "react";
import { usersAPI } from "../api/apiClient";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", role: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Read all
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const users = await usersAPI.getAll();
      setUsers(users);
    } finally {
      setLoading(false);
    }
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
    try {
      setLoading(true);
      await usersAPI.update(editingId, form);
      setEditingId(null);
      setForm({ name: "", email: "", role: "" });
      await fetchUsers();
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      setLoading(true);
      await usersAPI.delete(id);
      await fetchUsers();
    } finally {
      setLoading(false);
    }
  };

  // Read one by ID
  const handleViewOne = async (id) => {
    const user = await usersAPI.getById(id);
    alert(
      `User #${user.id}\nName: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}`
    );
  };

  return (
    <div className="max-w-3xl mx-auto my-8 px-5">
      <h1 className="mb-5 text-[#1a1a2e] text-3xl font-bold">Users</h1>

      {/* Форма редактирования (появляется при нажатии Edit) */}
      {editingId && (
        <form className="bg-white p-5 rounded-lg mb-6 shadow-sm" onSubmit={handleUpdate}>
          <h3 className="mb-3 text-[#1a1a2e] font-semibold">Edit User #{editingId}</h3>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            className="block w-full px-3 py-2 mb-2 border border-gray-300 rounded text-sm"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="block w-full px-3 py-2 mb-2 border border-gray-300 rounded text-sm"
          />
          <select name="role" value={form.role} onChange={handleChange} className="block w-full px-3 py-2 mb-3 border border-gray-300 rounded text-sm">
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
          <div className="flex gap-2">
            <button 
              type="submit" 
              disabled={loading}
              className={`px-5 py-2 rounded cursor-pointer text-sm transition-colors ${
                loading
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-[#0f3460] text-white hover:bg-[#0a2647]'
              }`}
            >
              {loading ? "Loading..." : "Save"}
            </button>
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
                setForm({ name: "", email: "", role: "" });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
        <thead>
          <tr className="bg-[#1a1a2e] text-white">
            <th className="p-3 text-left border-b text-sm">ID</th>
            <th className="p-3 text-left border-b text-sm">Name</th>
            <th className="p-3 text-left border-b text-sm">Email</th>
            <th className="p-3 text-left border-b text-sm">Role</th>
            <th className="p-3 text-left border-b text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan="5" className="p-3 text-center text-gray-600">
                Loading users...
              </td>
            </tr>
          )}
          {users.map((u) => (
            <tr key={u.id} className="border-b">
              <td className="p-3 text-sm">{u.id}</td>
              <td className="p-3 text-sm">{u.name}</td>
              <td className="p-3 text-sm">{u.email}</td>
              <td className="p-3 text-sm">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-[#e94560] text-white' : 'bg-gray-300 text-gray-800'}`}>
                  {u.role}
                </span>
              </td>
              <td className="p-3 text-sm space-x-1">
                <button
                  disabled={loading}
                  className={`px-3 py-1 rounded text-xs cursor-pointer transition-colors ${
                    loading
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-[#533483] text-white hover:bg-[#3d2463]'
                  }`}
                  onClick={() => handleViewOne(u.id)}
                >
                  View
                </button>
                <button 
                  disabled={loading}
                  className={`px-3 py-1 rounded text-xs cursor-pointer transition-colors ${
                    loading
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-[#0f3460] text-white hover:bg-[#0a2647]'
                  }`}
                  onClick={() => handleEdit(u)}
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
