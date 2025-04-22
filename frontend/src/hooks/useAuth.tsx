"use client";

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { jwtDecode } from 'jwt-decode';
import React from 'react'; // Asegúrate de tener esta importación

interface User {
  id_usuario: number;
  nombre: string;
  username: string;
  tipo: 'cliente' | 'administrador';
  // ... otros campos de tu usuario
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string } | undefined>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    router.push('/login');
  }, [router]);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      try {
        const decodedToken = jwtDecode<any>(storedToken);
        setUser(decodedToken.usuario);
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        logout();
      }
    }
  }, [logout]);

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post('/usuario/login', { username, contrasena: password });
      if (response.data?.token) {
        localStorage.setItem('authToken', response.data.token);
        setToken(response.data.token);
        try {
          const decodedToken = jwtDecode<any>(response.data.token);
          setUser(decodedToken.usuario);
        } catch (error) {
          console.error('Error al decodificar el token:', error);
        }
        return { success: true };
      } else if (response.data?.message) {
        return { success: false, message: response.data.message };
      } else {
        return { success: false, message: 'Error desconocido al iniciar sesión.' };
      }
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      return { success: false, message: error?.response?.data?.message || 'Error al iniciar sesión.' };
    }
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};