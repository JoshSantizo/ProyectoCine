'use client';

import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Alert
} from '@mui/material';
import { useAuthContext } from '@/app/layout';
import { useRouter } from 'next/navigation'; 

interface Pelicula {
    id: number;
    nombre: string;
    duracion: number;
    sinopsis: string;
    imagen: string;
}

interface SalaConPelicula {
    id: number;
    nombre: string; 
    filas: number;
    columnas: number;
    pelicula_id: number | null; 
    pelicula: Pelicula | null; 
}

const DashboardPage = () => {
    const { token } = useAuthContext();
    const router = useRouter(); 
    const [salasConPeliculas, setSalasConPeliculas] = useState<SalaConPelicula[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!token) {
                setLoading(false);
                setError('No hay token de autenticación. Inicia sesión para ver el contenido.');
                return;
            }

            try {
                const salasResponse = await fetch('http://localhost:3001/salas', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!salasResponse.ok) {
                    throw new Error(`Error al cargar salas: ${salasResponse.statusText}`);
                }
                const salasData: SalaConPelicula[] = await salasResponse.json();

                const salasConFuncionesValidas = salasData.filter(
                    sala => sala.pelicula !== null && sala.pelicula.id !== null
                );

                if (salasConFuncionesValidas.length === 0 && salasData.length > 0) {
                    setError('Hay salas, pero ninguna tiene una película válida asignada para mostrar.');
                } else if (salasData.length === 0) {
                    setError('No hay salas disponibles en el sistema.');
                }

                setSalasConPeliculas(salasConFuncionesValidas);

            } catch (err: any) {
                console.error('Error al cargar los datos del dashboard:', err);
                setError(err.message || 'Error al cargar los datos del dashboard.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    // Función para manejar el clic en la Card de las salas
    const handleCardClick = (movieId: number) => {
        router.push(`/reservaciones/${movieId}`); 
    };

    if (loading) {
        return (
            <Container sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="h5">Cargando cartelera...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Cartelera Actual por Sala
            </Typography>

            {salasConPeliculas.length === 0 ? (
                <Typography>No hay funciones de películas disponibles en este momento.</Typography>
            ) : (
                <Grid container spacing={4} justifyContent="center">
                    {salasConPeliculas.map((sala, index) => (
                        <Grid
                            item
                            key={sala.id || index}
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}
                        >
                            <Card
                                sx={{
                                    width: '100%',
                                    maxWidth: 300,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    backgroundColor: 'white',
                                    color: 'black',
                                    boxShadow: 3,
                                    cursor: 'pointer' 
                                }}
                                onClick={() => sala.pelicula?.id && handleCardClick(sala.pelicula.id)}
                            >
                                {sala.pelicula?.imagen && (
                                    <CardMedia
                                        component="img"
                                        sx={{
                                            padding: '1rem',
                                            objectFit: 'contain',
                                            maxHeight: 350,
                                            width: '100%',
                                            flexShrink: 0
                                        }}
                                        image={sala.pelicula.imagen}
                                        alt={sala.pelicula.nombre || 'Película'}
                                    />
                                )}

                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5" component="div" sx={{ color: 'black' }}>
                                        {sala.pelicula?.nombre || 'Película No Asignada'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#333', fontWeight: 'bold' }}>
                                        Sala: <span style={{ fontWeight: 'normal' }}>{sala.nombre}</span>
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#333', fontWeight: 'bold' }}>
                                        Asientos Totales: <span style={{ fontWeight: 'normal' }}>{sala.filas * sala.columnas}</span>
                                    </Typography>

                                    {sala.pelicula?.duracion && (
                                        <Typography variant="body2" sx={{ color: '#555', mt: 1 }}>
                                            Duración: {sala.pelicula.duracion} min
                                        </Typography>
                                    )}
                                    {sala.pelicula?.sinopsis && (
                                        <Typography variant="body2" sx={{ color: '#555' }}>
                                            Sinopsis: {sala.pelicula.sinopsis.substring(0, 100)}...
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default DashboardPage;
