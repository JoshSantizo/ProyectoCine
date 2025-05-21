// src/app/dashboard/page.tsx
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

// Definición de la interfaz para los datos de la Película
interface Pelicula {
    id: number;
    nombre: string;
    duracion: number;
    sinopsis: string;
    imagen: string;
}

// Definición de la interfaz para los datos de la Sala que ahora incluyen el objeto Pelicula
interface SalaConPelicula { 
    id: number;
    nombre: string; // Nombre de la sala
    filas: number;
    columnas: number;
    pelicula_id: number | null; // ID de la película asociada (puede ser null)
    pelicula: Pelicula | null; // <-- ¡AQUÍ ESTÁ EL CAMBIO! Ahora es un objeto Pelicula o null
}

const DashboardPage = () => {
    const { token } = useAuthContext(); 
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
                
                // Filtramos las salas para mostrar solo aquellas que tienen una película realmente asignada (objeto 'pelicula' no null)
                const salasConFuncionesValidas = salasData.filter(
                    sala => sala.pelicula !== null && sala.pelicula.id !== null // Aseguramos que el objeto película existe y tiene un ID
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
                                    boxShadow: 3 
                                }}
                            >
                                {/* Solo se renderiza la imagen si la URL de la película existe en el objeto 'pelicula' */}
                                {sala.pelicula?.imagen && ( // <-- ¡CAMBIO AQUÍ! Accede a sala.pelicula.imagen
                                    <CardMedia
                                        component="img"
                                        sx={{ 
                                            padding: '1rem', 
                                            objectFit: 'contain', 
                                            maxHeight: 350, 
                                            width: '100%',
                                            flexShrink: 0 
                                        }}
                                        image={sala.pelicula.imagen} // <-- ¡CAMBIO AQUÍ! Accede a sala.pelicula.imagen
                                        alt={sala.pelicula.nombre || 'Película'} // <-- ¡CAMBIO AQUÍ! Accede a sala.pelicula.nombre
                                    />
                                )}
                                
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5" component="div" sx={{ color: 'black' }}>
                                        {sala.pelicula?.nombre || 'Película No Asignada'} {/* <-- ¡CAMBIO AQUÍ! Accede a sala.pelicula.nombre */}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#333', fontWeight: 'bold' }}>
                                        Sala: <span style={{ fontWeight: 'normal' }}>{sala.nombre}</span> 
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#333', fontWeight: 'bold' }}>
                                        Asientos Totales: <span style={{ fontWeight: 'normal' }}>{sala.filas * sala.columnas}</span> 
                                    </Typography>
                                    
                                    {/* Solo se muestra si la duración existe en el objeto 'pelicula' */}
                                    {sala.pelicula?.duracion && ( // <-- ¡CAMBIO AQUÍ! Accede a sala.pelicula.duracion
                                        <Typography variant="body2" sx={{ color: '#555', mt: 1 }}>
                                            Duración: {sala.pelicula.duracion} min {/* <-- ¡CAMBIO AQUÍ! Accede a sala.pelicula.duracion */}
                                        </Typography>
                                    )}
                                    {/* Solo se muestra si la sinopsis existe en el objeto 'pelicula' */}
                                    {sala.pelicula?.sinopsis && ( // <-- ¡CAMBIO AQUÍ! Accede a sala.pelicula.sinopsis
                                        <Typography variant="body2" sx={{ color: '#555' }}>
                                            Sinopsis: {sala.pelicula.sinopsis.substring(0, 100)}... {/* <-- ¡CAMBIO AQUÍ! Accede a sala.pelicula.sinopsis */}
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