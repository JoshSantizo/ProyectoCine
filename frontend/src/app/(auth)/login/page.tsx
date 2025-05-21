'use client'; 

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import {
    Container, Box, Typography, TextField, Button, Alert, CircularProgress, Link
} from '@mui/material';
import NextLink from 'next/link'; 
import { useAuthContext } from '@/app/layout'; 

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter(); 
    const { setToken, setUser } = useAuthContext(); 

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault(); 

        setError(null); 
        setLoading(true); 

        try {
            const response = await fetch('http://localhost:3001/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, contrasena }),
            });

            const data = await response.json(); 

            if (!response.ok) {
                throw new Error(data.mensaje || 'Error en el inicio de sesión');
            }
            setToken(data.token);
            setUser({ id: data.userId, username: data.username, tipo: data.tipo });

            router.push('/dashboard'); 

        } catch (err: any) {
            console.error('Error durante el inicio de sesión:', err);
            setError(err.message || 'Error desconocido al iniciar sesión.');
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
                    padding: 4,
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'white'
                }}
            >
                <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                    Iniciar Sesión
                </Typography>
                <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
                    {error && <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{error}</Alert>}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Nombre de Usuario"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loading}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Contraseña"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        disabled={loading}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Iniciar Sesión'}
                    </Button>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginPage;
