// src/app/layout.tsx
'use client';

import { Inter } from 'next/font/google';
// ¡CAMBIO AQUÍ! La ruta de importación a globals.css
import '@/styles/globals.css'; // Apunta a src/styles/globals.css

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, CssBaseline, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from '@/components/Sidebar'; // Importa tu componente Sidebar
import { useRouter } from 'next/navigation'; // Importa useRouter para la navegación

const inter = Inter({ subsets: ['latin'] });

// Define la interfaz para la información del usuario
interface User {
  id: number;
  username: string;
  tipo: 'cliente' | 'administrador';
}

// Define la interfaz para el contexto de autenticación
interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
  login: (username: string, contrasena: string) => Promise<void>;
  logout: () => void;
  register: (nombre: string, username: string, contrasena: string) => Promise<void>;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
}

// Crea el contexto de autenticación
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto de autenticación
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthContextProvider');
  }
  return context;
};

// Proveedor de contexto de autenticación
export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false); // Estado para el drawer móvil
  const router = useRouter();

  // URL base de tu API backend
  const API_BASE_URL = 'http://localhost:3001';

  // Efecto para cargar el token y el usuario desde localStorage al inicio
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsLoggedIn(true);
      } catch (e) {
        console.error("Error parsing stored user data:", e);
        logout(); // Limpiar si los datos están corruptos
      }
    }
  }, []);

  // Efecto para actualizar localStorage cada vez que el token o el usuario cambian
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    setIsLoggedIn(!!token); // Actualiza isLoggedIn basado en la presencia del token
  }, [token, user]);

  // Función de login
  const login = useCallback(async (username: string, contrasena: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, contrasena }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.mensaje || 'Error en el inicio de sesión');
      }
      setToken(data.token);
      setUser({ id: data.userId, username: data.username, tipo: data.tipo });
      setIsLoggedIn(true);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error de login:', error);
      throw error; // Propagar el error para que el componente de login lo maneje
    }
  }, [API_BASE_URL, router]);

  // Función de registro
  const register = useCallback(async (nombre: string, username: string, contrasena: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, username, contrasena }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.mensaje || 'Error en el registro');
      }
      // Después de registrar, puedes iniciar sesión automáticamente o redirigir al login
      // Para este ejemplo, simplemente indicamos éxito y el usuario puede ir al login
      console.log('Registro exitoso:', data.mensaje);
      router.push('/login'); // Redirigir al login después de un registro exitoso
    } catch (error: any) {
      console.error('Error de registro:', error);
      throw error;
    }
  }, [API_BASE_URL, router]);

  // Función de logout
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login'); // Redirigir al login después de cerrar sesión
  }, [router]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoggedIn, login, logout, register, setToken, setUser }}>
      <html lang="en">
        <body className={inter.className}>
          <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
              position="fixed"
              sx={{
                width: { sm: `calc(100% - 240px)` },
                ml: { sm: `240px` },
                backgroundColor: '#333', // Color oscuro para AppBar
                color: 'white',
              }}
            >
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, display: { sm: 'none' } }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div">
                  Cine Online
                </Typography>
                {/* Aquí puedes añadir más elementos a la AppBar si lo deseas */}
              </Toolbar>
            </AppBar>
            <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
            <Box
              component="main"
              sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}
            >
              <Toolbar /> {/* Para compensar la AppBar fija */}
              {children}
            </Box>
          </Box>
        </body>
      </html>
    </AuthContext.Provider>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthContextProvider>
      {children}
    </AuthContextProvider>
  );
}