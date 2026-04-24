const API_BASE = "http://localhost:3001";
const API = `${API_BASE}/api`;

export const IMAGE_BASE = API_BASE;

const getAuthToken = () => {
  return localStorage.getItem("token") || "";
};

const getAuthHeaders = (isFormData = false) => {
  const token = getAuthToken();
  const headers = {};
  
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return headers;
};

const request = async (endpoint, options = {}) => {
  const { method = "GET", body, isFormData = false, ...customOptions } = options;
  
  const config = {
    method,
    headers: getAuthHeaders(isFormData),
    ...customOptions,
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  try {
    const res = await fetch(`${API}${endpoint}`, config);
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || data.message || `Request failed with status ${res.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

export const authAPI = {
  login: (email, password) => 
    request("/auth/login", { 
      method: "POST", 
      body: { email, password } 
    }),

  register: (name, email, password) => 
    request("/auth/register", { 
      method: "POST", 
      body: { name, email, password } 
    }),
};

export const productsAPI = {
  getAll: () => request("/products"),
  
  getById: (id) => request(`/products/${id}`),

  create: (data) => {
    const isFormData = data instanceof FormData;
    return request("/products", { 
      method: "POST", 
      body: data, 
      isFormData 
    });
  },

  update: (id, data) => {
    const isFormData = data instanceof FormData;
    return request(`/products/${id}`, { 
      method: "PUT", 
      body: data, 
      isFormData 
    });
  },

  delete: (id) => request(`/products/${id}`, { method: "DELETE" }),
};

export const categoriesAPI = {
  getAll: () => request("/categories"),
  
  getById: (id) => request(`/categories/${id}`),

  create: (data) => request("/categories", { method: "POST", body: data }),

  update: (id, data) => request(`/categories/${id}`, { method: "PUT", body: data }),

  delete: (id) => request(`/categories/${id}`, { method: "DELETE" }),
};

export const usersAPI = {
  getAll: () => request("/users"),
  
  getById: (id) => request(`/users/${id}`),

  update: (id, data) => request(`/users/${id}`, { method: "PUT", body: data }),

  delete: (id) => request(`/users/${id}`, { method: "DELETE" }),
};
