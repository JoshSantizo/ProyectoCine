'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import Link from 'next/link';

const RegisterPage = () => {
  const [nombre, setNombre] = useState('');
  const [username, setUsername] = useState('');
  const [contrasena, setContrasena] = useState(''); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/auth/register', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          username,
          contrasena, 
        }),
      });

      if (response.ok) {
        router.push('/login');
      } else {
        const errorData = await response.json();
        setError(errorData.mensaje || 'Error en el registro. Por favor, inténtalo de nuevo.');
      }
    } catch (err) {
      console.error('Error al conectar con el servidor:', err);
      setError('No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Registrarse
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="nombre"
            label="Nombre Completo"
            name="nombre"
            autoComplete="name"
            autoFocus
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Nombre de Usuario"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="contrasena" 
            label="Contraseña"
            type="password"
            id="contrasena" 
            autoComplete="new-password"
            value={contrasena} 
            onChange={(e) => setContrasena(e.target.value)} 
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrarse'}
          </Button>

        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;