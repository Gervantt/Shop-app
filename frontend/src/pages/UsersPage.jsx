import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { usersAPI } from "../api/apiClient";
import { showNotification } from "../store/notificationSlice";
import ConfirmModal from "../components/ConfirmModal";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", role: "" });
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, userId: null });
  const dispatch = useDispatch();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersRes = await usersAPI.getAll();
      setUsers(usersRes || []);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setForm({ name: user.name, email: user.email, role: user.role });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await usersAPI.update(editingId, form);
      setEditingId(null);
      setForm({ name: "", email: "", role: "" });
      dispatch(showNotification({ message: `Account "${form.name}" updated`, type: "success" }));
      await fetchUsers();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, userId: id });
  };

  const handleConfirmDelete = async () => {
    const id = deleteModal.userId;
    try {
      setLoading(true);
      await usersAPI.delete(id);
      dispatch(showNotification({ message: "Member removed from collective", type: "success" }));
      await fetchUsers();
    } finally {
      setLoading(false);
      setDeleteModal({ isOpen: false, userId: null });
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-8 flex flex-col gap-12">
      <header>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-rose-100">
          Internal Console
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-4">
          Collective <span className="text-primary italic">Members</span>
        </h1>
        <p className="text-slate-400 font-medium text-lg max-w-2xl">
          Manage access and profiles for all Red Apple members. Use this console with care.
        </p>
      </header>

      {editingId && (
        <section className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-2xl shadow-rose-500/5 animate-in slide-in-from-top duration-500">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic">Modify Account</h3>
            <button 
              onClick={() => { setEditingId(null); setForm({ name: "", email: "", role: "" }); }}
              className="text-slate-300 hover:text-slate-900 transition-colors"
            >
              ✕
            </button>
          </div>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-6" onSubmit={handleUpdate}>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Name</label>
              <input name="name" value={form.name} onChange={handleChange} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-rose-100 focus:border-rose-500 transition-all"/>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-rose-100 focus:border-rose-500 transition-all"/>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Role</label>
              <select name="role" value={form.role} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-rose-100 focus:border-rose-500 transition-all appearance-none">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="md:col-span-3 flex justify-end gap-4 mt-4">
              <button type="submit" disabled={loading} className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-black tracking-widest uppercase text-xs hover:bg-primary transition-all active:scale-95 shadow-xl shadow-slate-200">
                Update Account
              </button>
            </div>
          </form>
        </section>
      )}

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-rose-500/5 overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">ID</th>
              <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Member</th>
              <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Access</th>
              <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((u) => (
              <tr key={u.id} className="group hover:bg-slate-50 transition-colors">
                <td className="px-8 py-6 text-sm font-bold text-slate-400 tracking-tighter">#{u.id}</td>
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors">{u.name}</span>
                    <span className="text-xs font-medium text-slate-400">{u.email}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                    u.role === 'admin' ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-slate-50 border-slate-100 text-slate-400'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-8 py-6 text-right space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    disabled={loading} 
                    onClick={() => handleEdit(u)}
                    className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary hover:border-primary transition-all active:scale-90"
                    title="Edit Member"
                  >
                    ✎
                  </button>
                  <button 
                    disabled={loading} 
                    onClick={() => handleDeleteClick(u.id)}
                    className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-rose-600 hover:border-rose-600 transition-all active:scale-90"
                    title="Remove Member"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {users.length === 0 && !loading && (
          <div className="py-20 flex flex-col items-center text-center">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No collective members found.</p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Remove Member"
        message="Are you sure you want to remove this member from the collective? This access cannot be restored."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, userId: null })}
      />
    </div>
  );
}

export default UsersPage;

