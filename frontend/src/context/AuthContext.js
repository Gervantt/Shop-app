import React, { createContext, useState, useEffect } from "react";

// 1) Создаём контекст
export const AuthContext = createContext();

const API = "http://localhost:3001/api";

// 2) Провайдер оборачивает всё приложение
export function AuthProvider({ children }) {
  // Храним пользователя в state; при перезагрузке берём из localStorage
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // Синхронизируем localStorage при изменении user
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Логин — отправляем email+password на сервер
  const login = async (email, password) => {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setUser(data);
    return data;
  };

  // Регистрация — создаём нового пользователя
  const register = async (name, email, password) => {
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setUser(data);
    return data;
  };

  // Выход
  const logout = () => {
    setUser(null);
  };

  // 3) Передаём данные и функции через value
  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
