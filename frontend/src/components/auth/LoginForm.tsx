"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Card, Button, ErrorMessage, LoadingSpinner } from '@/components/common';

interface LoginFormProps {}

const LoginForm: React.FC<LoginFormProps> = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setLoginSuccess(false);

    try {
      const result = await login(username, password);
      if (result?.success) {
        setLoginSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else if (result?.message) {
        setError(result.message);
      } else {
        setError('Error al iniciar sesión. Credenciales inválidas.');
      }
    } catch (err: any) {
      console.error('Error al iniciar sesión:', err);
      setError(err?.response?.data?.mensaje || 'Ocurrió un error al comunicarse con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Usuario:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <ErrorMessage message={error} />}
        {loginSuccess && <div style={{ color: 'green', marginBottom: '1rem', textAlign: 'center' }}>Ingreso exitoso</div>}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <LoadingSpinner size="small" /> : 'Iniciar Sesión'}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;