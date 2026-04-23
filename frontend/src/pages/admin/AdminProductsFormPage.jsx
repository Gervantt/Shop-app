import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../../api/apiClient';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../store/notificationSlice';

const AdminProductsFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    stock: '0',
    image: null,
    imagePreview: '',
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditMode);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  const fetchInitialData = async () => {
    try {
      if (isEditMode) {
        setPageLoading(true);
        const [productData, categoriesData] = await Promise.all([
          productsAPI.getById(id),
          categoriesAPI.getAll(),
        ]);

        if (!productData) {
          dispatch(showNotification({ message: 'Product not found', type: 'error' }));
          navigate('/admin/products');
          return;
        }

        setFormData({
          name: productData.name || '',
          description: productData.description || '',
          price: productData.price || '',
          categoryId: productData.categoryId || '',
          stock: productData.stock || '0',
          image: null,
          imagePreview: productData.image ? (productData.image.startsWith('http') ? productData.image : `http://localhost:3001${productData.image}`) : '',
        });
        setCategories(categoriesData || []);
        setCategoriesLoading(false);
        setPageLoading(false);
      } else {
        const categoriesData = await categoriesAPI.getAll();
        setCategories(categoriesData || []);
        setCategoriesLoading(false);
      }
    } catch (error) {
      dispatch(showNotification({ message: 'Failed to load data', type: 'error' }));
      if (isEditMode) navigate('/admin/products');
    } finally {
      if (isEditMode) setPageLoading(false);
      setCategoriesLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      dispatch(showNotification({ message: 'Product name is required', type: 'error' }));
      return false;
    }
    if (!formData.price) {
      dispatch(showNotification({ message: 'Price is required', type: 'error' }));
      return false;
    }
    if (!formData.categoryId) {
      dispatch(showNotification({ message: 'Category is required', type: 'error' }));
      return false;
    }
    if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      dispatch(showNotification({ message: 'Price must be a positive number', type: 'error' }));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('categoryId', formData.categoryId);
      submitData.append('stock', formData.stock);
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      if (isEditMode) {
        await productsAPI.update(id, submitData);
        dispatch(showNotification({ message: 'Product updated successfully', type: 'success' }));
      } else {
        await productsAPI.create(submitData);
        dispatch(showNotification({ message: 'Product created successfully', type: 'success' }));
      }
      navigate('/admin/products');
    } catch (error) {
      dispatch(showNotification({ message: error.message || `Failed to ${isEditMode ? 'update' : 'create'} product`, type: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-400 text-lg">
        Loading product data...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-10 max-w-4xl mx-auto border border-slate-100">
      <div className="mb-10 pb-6 border-b border-slate-100">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
        <p className="text-slate-500 font-medium">{isEditMode ? 'Update the product details below' : 'Fill in the details below to create a new product'}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold text-slate-800 border-b-2 border-slate-100 pb-3">Basic Information</h2>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., iPhone 15 Pro"
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-800"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Product description..."
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-800 min-h-[120px]"
              rows="4"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Category *</label>
              {categoriesLoading ? (
                <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-400">Loading...</div>
              ) : (
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-800 cursor-pointer"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-800"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold text-slate-800 border-b-2 border-slate-100 pb-3">Stock & Media</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Current Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-800"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Product Image</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="px-4 py-3 bg-slate-50 border border-slate-200 border-dashed rounded-xl text-slate-600 hover:bg-slate-100 hover:border-blue-400 transition-all flex items-center justify-center gap-2 font-bold"
              >
                <span>📁</span> {formData.image ? 'Change Image' : 'Upload Image'}
              </button>
            </div>
          </div>

          {formData.imagePreview && (
            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 border-dashed rounded-xl flex justify-center overflow-hidden">
              <img src={formData.imagePreview} alt="Preview" className="max-h-80 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300" />
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-end mt-4 pt-8 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-8 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all active:scale-95 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-10 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-w-[180px]"
          >
            {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Product' : 'Create Product')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductsFormPage;
