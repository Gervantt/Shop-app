import React, { useState, useEffect } from 'react';
import { usersAPI } from '../../api/apiClient';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../store/notificationSlice';
import ConfirmModal from '../../components/ConfirmModal';

const AdminUsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, userId: null });
  const dispatch = useDispatch();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await usersAPI.getAll();
      setUsers(data || []);
    } catch (error) {
      dispatch(showNotification({ message: 'Failed to load users', type: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';

    try {
      await usersAPI.update(userId, { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      dispatch(showNotification({
        message: `User role changed to ${newRole}`,
        type: 'success'
      }));
    } catch (error) {
      dispatch(showNotification({ message: error.message || 'Failed to update user', type: 'error' }));
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, userId: id });
  };

  const handleConfirmDelete = async () => {
    const id = deleteModal.userId;
    try {
      await usersAPI.delete(id);
      setUsers(users.filter(u => u.id !== id));
      dispatch(showNotification({ message: 'User deleted successfully', type: 'success' }));
    } catch (error) {
      dispatch(showNotification({ message: error.message || 'Failed to delete user', type: 'error' }));
    } finally {
      setDeleteModal({ isOpen: false, userId: null });
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">User Management</h1>
          <p className="text-slate-500 mt-1">Total registered: <span className="font-bold text-blue-600">{users.length}</span></p>
        </div>
        <div className="w-full md:w-80">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-800"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">Loading users...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-slate-500 font-medium">
                    No users found matching your search
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-500 font-medium text-sm">#{user.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        user.role === 'admin' 
                        ? 'bg-purple-50 text-purple-600' 
                        : 'bg-slate-50 text-slate-600'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleRoleChange(user.id, user.role)}
                          className={`px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                            user.role === 'admin'
                            ? 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            : 'bg-white text-blue-600 border border-blue-100 hover:bg-blue-50'
                          }`}
                        >
                          {user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user.id)}
                          className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold text-xs hover:bg-red-100 transition-all active:scale-95 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete User"
        message={`Are you sure you want to delete this user? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, userId: null })}
      />
    </div>
  );
};

export default AdminUsersList;
