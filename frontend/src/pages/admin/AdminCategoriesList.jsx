import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoriesAPI } from '../../api/apiClient';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../store/notificationSlice';
import ConfirmModal from '../../components/ConfirmModal';

const AdminCategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, categoryId: null });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesAPI.getAll();
      setCategories(data || []);
    } catch (error) {
      dispatch(showNotification({ message: 'Failed to load categories', type: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/categories/edit/${id}`);
  };

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, categoryId: id });
  };

  const handleConfirmDelete = async () => {
    const id = deleteModal.categoryId;
    try {
      await categoriesAPI.delete(id);
      setCategories(categories.filter(c => c.id !== id));
      dispatch(showNotification({ message: 'Category deleted successfully', type: 'success' }));
    } catch (error) {
      dispatch(showNotification({ message: error.message || 'Failed to delete category', type: 'error' }));
    } finally {
      setDeleteModal({ isOpen: false, categoryId: null });
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Category Management</h1>
          <p className="text-slate-500 mt-1">Total categories: <span className="font-bold text-blue-600">{categories.length}</span></p>
        </div>
        <button 
          onClick={() => navigate('/admin/categories/add')}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:translate-y-0 cursor-pointer flex items-center gap-2"
        >
          <span className="text-xl">+</span> Add New Category
        </button>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="mb-8">
          <div className="max-w-md">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-800"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">Loading categories...</div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 text-slate-200">🏷️</div>
            <p className="text-slate-500 text-lg">{searchTerm ? 'No categories found' : 'No categories yet'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map(category => (
              <div key={category.id} className="group bg-slate-50 border border-slate-200 rounded-xl p-6 hover:bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">{category.name}</h3>
                  {category.description && (
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                      {category.description}
                    </p>
                  )}
                </div>
                <div className="mt-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(category.id)}
                    className="flex-1 bg-white text-blue-600 border border-blue-100 py-2 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(category.id)}
                    className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg font-bold text-sm hover:bg-red-100 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Category"
        message="Are you sure you want to delete this category? Products in this category will become uncategorized."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, categoryId: null })}
      />
    </div>
  );
};

export default AdminCategoriesList;
