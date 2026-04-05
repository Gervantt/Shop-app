const API = "http://localhost:3001/api";

// ============ Auth ============
export const authAPI = {
  login: async (email, password) => {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },

  register: async (name, email, password) => {
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },
};

// ============ Products ============
export const productsAPI = {
  getAll: async () => {
    const res = await fetch(`${API}/products`);
    return res.json();
  },

  create: async (data) => {
    const res = await fetch(`${API}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  update: async (id, data) => {
    const res = await fetch(`${API}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API}/products/${id}`, {
      method: "DELETE",
    });
    return res.json();
  },
};

// ============ Categories ============
export const categoriesAPI = {
  getAll: async () => {
    const res = await fetch(`${API}/categories`);
    return res.json();
  },

  create: async (data, userId) => {
    const res = await fetch(`${API}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Id": String(userId),
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  update: async (id, data, userId) => {
    const res = await fetch(`${API}/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-User-Id": String(userId),
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  delete: async (id, userId) => {
    const res = await fetch(`${API}/categories/${id}`, {
      method: "DELETE",
      headers: { "X-User-Id": String(userId) },
    });
    return res.json();
  },
};

// ============ Users ============
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API}/users/${id}`, {
      method: "DELETE",
    });
    return res.json();
  },
};
