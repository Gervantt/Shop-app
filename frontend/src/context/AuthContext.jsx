import React, { createContext, useState, useEffect } from "react";
import { authAPI } from "../api/apiClient";

// 1) Создаём контекст
export const AuthContext = createContext();

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
    const data = await authAPI.login(email, password);
    setUser(data);
    return data;
  };

  // Регистрация — создаём нового пользователя
  const register = async (name, email, password) => {
    const data = await authAPI.register(name, email, password);
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
