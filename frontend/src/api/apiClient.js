const API = "http://localhost:3001/api";

const getAuthToken = () => {
  return localStorage.getItem("token") || "";
};

const getAuthHeaders = (isFormData = false) => {
  const token = getAuthToken();
  return {
    ...(!isFormData && { "Content-Type": "application/json" }),
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const authAPI = {
  login: async (email, password) => {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },

  register: async (name, email, password) => {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },
};

export const productsAPI = {
  getAll: async () => {
    const res = await fetch(`${API}/products`);
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${API}/products/${id}`);
    if (!res.ok) throw new Error("Product not found");
    return res.json();
  },

  create: async (data) => {
    const isFormData = data instanceof FormData;
    const res = await fetch(`${API}/products`, {
      method: "POST",
      headers: getAuthHeaders(isFormData),
      body: isFormData ? data : JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to create product");
    return result;
  },

  update: async (id, data) => {
    const isFormData = data instanceof FormData;
    const res = await fetch(`${API}/products/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(isFormData),
      body: isFormData ? data : JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to update product");
    return result;
  },

  delete: async (id) => {
    const res = await fetch(`${API}/products/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to delete product");
    return result;
  },
};

export const categoriesAPI = {
  getAll: async () => {
    const res = await fetch(`${API}/categories`);
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${API}/categories/${id}`);
    return res.json();
  },

  create: async (data) => {
    const res = await fetch(`${API}/categories`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to create category");
    return result;
  },

  update: async (id, data) => {
    const res = await fetch(`${API}/categories/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to update category");
    return result;
  },

  delete: async (id) => {
    const res = await fetch(`${API}/categories/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to delete category");
    return result;
  },
};

export const usersAPI = {
  getAll: async () => {
    const res = await fetch(`${API}/users`);
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${API}/users/${id}`);
    return res.json();
  },

  update: async (id, data) => {
    const res = await fetch(`${API}/users/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to update user");
    return result;
  },

  delete: async (id) => {
    const res = await fetch(`${API}/users/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to delete user");
    return result;
  },
};
