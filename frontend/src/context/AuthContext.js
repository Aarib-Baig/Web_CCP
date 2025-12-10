import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    const interceptor = axios.interceptors.request.use(
      function (config) {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          config.headers.Authorization = 'Bearer ' + storedToken;
        }
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    // Initialize state
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);

    // Cleanup interceptor on unmount
    return function () {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  function login(newToken, userData) {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }

  function isAdmin() {
    return user && user.role === 'admin';
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}