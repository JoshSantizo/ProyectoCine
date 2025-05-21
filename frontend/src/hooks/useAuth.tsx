import { useState, useEffect, useCallback } from 'react'; 
import { useRouter } from 'next/navigation';

const API_BASE_URL = 'http://localhost:3001'; 

const useAuth = () => {
    const initialToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    const [token, setToken] = useState<string | null>(initialToken);
    const [isLoggedIn, setIsLoggedIn] = useState(!!initialToken); 

    const router = useRouter();

    const login = useCallback(async (username: string, contrasena: string) => { 
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, contrasena }),
            });

            const data = await response.json(); 

            if (response.ok) {
                if (data.token) {
                    localStorage.setItem('authToken', data.token);
                    setToken(data.token);
                    setIsLoggedIn(true);
                    return { success: true, message: data.mensaje || 'Inicio de sesión exitoso' };
                } else {
                    console.error('Login exitoso, pero el token no fue recibido.');
                    return { success: false, message: 'Respuesta del servidor incompleta (token ausente).' };
                }
            } else {
                const errorMessage = data.mensaje || 'Credenciales inválidas. Inténtalo de nuevo.';
                console.error('Error en el login:', errorMessage);
                return { success: false, message: errorMessage };
            }
        } catch (error) {
            console.error('Error de red o del servidor:', error);
            return { success: false, message: 'Error de conexión. Inténtalo de nuevo.' };
        }
    }, []);

    const register = useCallback(async (nombre: string, username: string, contrasena: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, username, contrasena }),
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, message: data.mensaje || 'Usuario registrado exitosamente' };
            } else {
                return { success: false, message: data.mensaje || 'Error al registrar el usuario.' };
            }
        } catch (error) {
            console.error('Error de red o del servidor al registrar usuario:', error);
            return { success: false, message: 'No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.' };
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('authToken'); 
        setToken(null); 
        setIsLoggedIn(false); 
        router.push('/login');
    }, [router]);


    useEffect(() => {
    }, [token, logout]);


    return { isLoggedIn, login, logout, token, register };
};

export default useAuth;