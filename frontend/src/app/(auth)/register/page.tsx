// src/app/(auth)/register/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Card, Button, ErrorMessage, LoadingSpinner } from '@/components/common';

const RegisterPage = () => {
  const [nombre, setNombre] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (registrationSuccess) {
      const timer = setTimeout(() => {
        router.push('/login?registered=true');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [registrationSuccess, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    console.log('handleSubmit llamado');
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Datos a enviar:', { nombre, username, contrasena: password }); // <-- CORRECCIÓN AQUÍ
      const response = await api.post('/usuario/registro', { nombre, username, contrasena: password });
      console.log('Respuesta del servidor:', response);
      if (response.status === 201 && response.data?.mensaje) {
        setRegistrationSuccess(true);
      } else if (response.data?.mensaje) {
        setError(response.data.mensaje);
      } else {
        setError('Error desconocido al registrar la cuenta.');
      }
    } catch (err: any) {
      console.error('Error al registrar la cuenta (dentro del try):', err);
      setError(err?.response?.data?.mensaje || 'Error al registrar la cuenta.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
      <Card style={{ width: '400px' }}>
        <h2>Crear Cuenta</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nombre">Nombre:</label>
            <input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="username">Usuario:</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="password">Contraseña:</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
            <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          {error && <ErrorMessage message={error} />}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoadingSpinner size="small" /> : 'Crear Cuenta'}
          </Button>
        </form>
        {registrationSuccess && (
          <div style={{ marginTop: '1rem', textAlign: 'center', color: 'green' }}>
            Usuario creado exitosamente. Redirigiendo al login...
          </div>
        )}
      </Card>
    </div>
  );
};

export default RegisterPage;