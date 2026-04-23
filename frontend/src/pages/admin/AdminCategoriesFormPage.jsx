import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categoriesAPI } from '../../api/apiClient';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../store/notificationSlice';

const AdminCategoriesFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    try {
      setPageLoading(true);
      const category = await categoriesAPI.getById(id);
      if (!category) {
        dispatch(showNotification({ message: 'Category not found', type: 'error' }));
        navigate('/admin/categories');
        return;
      }
      setFormData({
        name: category.name || '',
        description: category.description || '',
      });
    } catch (error) {
      dispatch(showNotification({ message: 'Failed to load category', type: 'error' }));
      navigate('/admin/categories');
    } finally {
      setPageLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      dispatch(showNotification({ message: 'Category name is required', type: 'error' }));
      return;
    }

    try {
      setLoading(true);
      if (isEditMode) {
        await categoriesAPI.update(id, formData);
        dispatch(showNotification({ message: 'Category updated successfully', type: 'success' }));
      } else {
        await categoriesAPI.create(formData);
        dispatch(showNotification({ message: 'Category created successfully', type: 'success' }));
      }
      navigate('/admin/categories');
    } catch (error) {
      dispatch(showNotification({ message: error.message || `Failed to ${isEditMode ? 'update' : 'create'} category`, type: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-400 text-lg">
        Loading category data...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-10 max-w-3xl mx-auto border border-slate-100">
      <div className="mb-10 pb-6 border-b border-slate-100">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{isEditMode ? 'Edit Category' : 'Add New Category'}</h1>
        <p className="text-slate-500 font-medium">{isEditMode ? 'Update the category details below' : 'Create a new category for your products'}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Category Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Electronics"
            className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-800"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Category description..."
            className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-800 min-h-[150px]"
            rows="5"
          />
        </div>

        <div className="flex gap-4 justify-end mt-4 pt-8 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate('/admin/categories')}
            className="px-8 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all active:scale-95 cursor-pointer"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            className="px-10 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-w-[180px]"
          >
            {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Category' : 'Create Category')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCategoriesFormPage;
