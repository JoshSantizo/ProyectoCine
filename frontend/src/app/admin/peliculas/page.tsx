// src/app/admin/peliculas/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Image from 'next/image';

// Importar el hook de autenticación del contexto
import { useAuthContext } from '@/app/layout';

// Interfaz para el tipo de datos de una película
interface Pelicula {
    id?: number; // Es opcional porque no estará presente al crear una nueva
    nombre: string;
    sinopsis: string;
    duracion: number;
    imagen: string;
}

const AdminPeliculasPage = () => {
    // Obtener el token del contexto de autenticación
    const { token } = useAuthContext();

    const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentPelicula, setCurrentPelicula] = useState<Pelicula | null>(null);
    const [formValues, setFormValues] = useState<Pelicula>({
        nombre: '',
        sinopsis: '',
        duracion: 0,
        imagen: '',
    });

    // URL base de la API para películas
    const apiUrl = 'http://localhost:3001/peliculas';

    // Función para obtener todas las películas
    const fetchPeliculas = async () => {
        if (!token) {
            setError('No hay token de autenticación. Por favor, inicia sesión.');
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error Response:', response.status, errorText);
                throw new Error(`Error al cargar las películas: ${response.status} ${response.statusText}. Detalles: ${errorText.substring(0, 100)}...`);
            }
            const data = await response.json();
            setPeliculas(data);
        } catch (err: any) {
            setError(err.message || 'Error desconocido al cargar películas.');
            console.error('Error al cargar películas:', err);
        } finally {
            setLoading(false);
        }
    };

    // Cargar películas al montar el componente y cuando el token esté disponible
    useEffect(() => {
        if (token) {
            fetchPeliculas();
        }
    }, [token]);

    // Manejar la apertura del diálogo (para añadir o editar)
    const handleOpenDialog = (pelicula?: Pelicula) => {
        setCurrentPelicula(pelicula || null);
        setFormValues(pelicula || { nombre: '', sinopsis: '', duracion: 0, imagen: '' });
        setOpenDialog(true);
    };

    // Manejar el cierre del diálogo
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentPelicula(null);
        setFormValues({ nombre: '', sinopsis: '', duracion: 0, imagen: '' });
        setError(null);
    };

    // Manejar cambios en el formulario
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: name === 'duracion' ? parseInt(value) || 0 : value,
        }));
    };

    // Manejar el envío del formulario (añadir o editar)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const method = currentPelicula ? 'PUT' : 'POST';
        const url = currentPelicula ? `${apiUrl}/${currentPelicula.id}` : apiUrl;

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formValues),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.mensaje || 'Error al guardar la película.');
            }

            await fetchPeliculas();
            handleCloseDialog();
        } catch (err: any) {
            setError(err.message || 'Error desconocido al guardar película.');
            console.error('Error al guardar película:', err);
        } finally {
            setLoading(false);
        }
    };

    // Manejar la eliminación de una película
    const handleDelete = async (id: number | undefined) => {
        if (!id || !confirm('¿Estás seguro de que quieres eliminar esta película?')) {
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.mensaje || 'Error al eliminar la película.');
            }
            await fetchPeliculas();
        } catch (err: any) {
            setError(err.message || 'Error desconocido al eliminar película.');
            console.error('Error al eliminar película:', err);
        } finally {
            setLoading(false);
        }
    };

    // Muestra un indicador de carga si no hay películas cargadas aún
    if (loading && peliculas.length === 0) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>Cargando películas...</Typography>
            </Container>
        );
    }

    // Muestra un mensaje si hay un error y no hay token (por ejemplo, si no está logueado)
    if (error && !token) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
                <Typography variant="h6" sx={{ mt: 2 }}>Por favor, asegúrate de haber iniciado sesión.</Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 4, mb: 4 }} maxWidth={false}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Gestión de Películas
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Añadir Película
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {peliculas.length === 0 && !loading ? (
                <Typography variant="h6" align="center" color="text.secondary" sx={{ mt: 4 }}>
                    No hay películas para mostrar. Añade una nueva.
                </Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table aria-label="tabla de películas">
                        <TableHead>
                            <TableRow>
                                {/* Anchos fijos o mínimos para las columnas que no sean sinopsis */}
                                <TableCell sx={{ width: '5%', minWidth: '50px' }}>ID</TableCell>
                                <TableCell sx={{ width: '10%', minWidth: '80px' }}>Imagen</TableCell>
                                <TableCell sx={{ width: '20%', minWidth: '150px' }}>Nombre</TableCell>
                                <TableCell sx={{ width: '10%', minWidth: '80px' }}>Duración (min)</TableCell>
                                {/* La sinopsis ocupará el espacio restante y se truncará */}
                                <TableCell sx={{ width: 'auto' }}>Sinopsis</TableCell>
                                <TableCell sx={{ width: '15%', minWidth: '100px' }} align="right">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {peliculas.map((pelicula) => (
                                <TableRow key={pelicula.id}>
                                    <TableCell>{pelicula.id}</TableCell>
                                    <TableCell>
                                        {pelicula.imagen && (
                                            <Image
                                                src={pelicula.imagen}
                                                alt={pelicula.nombre}
                                                width={50}
                                                height={75}
                                                objectFit="contain"
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>{pelicula.nombre}</TableCell>
                                    <TableCell>{pelicula.duracion}</TableCell>
                                    {/* Propiedades CSS para truncar la sinopsis */}
                                    <TableCell sx={{
                                        maxWidth: '400px', // Puedes ajustar este valor si quieres un límite mayor o menor
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {pelicula.sinopsis}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton color="primary" onClick={() => handleOpenDialog(pelicula)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(pelicula.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Diálogo de Añadir/Editar Película (se mantiene sin cambios) */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{currentPelicula ? 'Editar Película' : 'Añadir Nueva Película'}</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="nombre"
                            name="nombre"
                            label="Nombre de la Película"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={formValues.nombre}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            margin="dense"
                            id="duracion"
                            name="duracion"
                            label="Duración (minutos)"
                            type="number"
                            fullWidth
                            variant="outlined"
                            value={formValues.duracion === 0 ? '' : formValues.duracion}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            margin="dense"
                            id="imagen"
                            name="imagen"
                            label="URL de la Imagen (Póster)"
                            type="url"
                            fullWidth
                            variant="outlined"
                            value={formValues.imagen}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            margin="dense"
                            id="sinopsis"
                            name="sinopsis"
                            label="Sinopsis"
                            type="text"
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            value={formValues.sinopsis}
                            onChange={handleChange}
                        />
                        {loading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <CircularProgress size={24} />
                            </Box>
                        )}
                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="inherit">
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} color="primary" variant="contained" disabled={loading}>
                        {currentPelicula ? 'Guardar Cambios' : 'Añadir'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminPeliculasPage;
