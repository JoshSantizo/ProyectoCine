// src/app/admin/salas/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Box, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, // Componentes de tabla
    IconButton, // Para los botones de lápiz y basura
    TextField,
    Dialog, DialogActions, DialogContent, DialogTitle,
    Alert, CircularProgress, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useAuthContext } from '@/app/layout'; // Ajusta la ruta si es diferente
import { useRouter } from 'next/navigation';

// Interfaces de datos (deben coincidir con la respuesta del backend)
interface Pelicula {
    id: number;
    nombre: string;
    // Agrega más campos de película si son relevantes para mostrar aquí
}

interface Sala {
    id: number;
    nombre: string;
    filas: number;
    columnas: number;
    pelicula_id: number | null;
    pelicula?: Pelicula; // Opcional, ya que puede ser null o no venir en todas las llamadas
}

const AdminSalasPage = () => {
    const { token, user } = useAuthContext();
    const router = useRouter();

    const [salas, setSalas] = useState<Sala[]>([]);
    const [peliculas, setPeliculas] = useState<Pelicula[]>([]); // Para el selector de películas
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Estado para el modal de Crear/Editar
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentSala, setCurrentSala] = useState<Partial<Sala> | null>(null); // Sala que se está editando/creando

    // Formulario (controlado)
    const [formNombre, setFormNombre] = useState('');
    const [formFilas, setFormFilas] = useState<number | ''>('');
    const [formColumnas, setFormColumnas] = useState<number | ''>('');
    const [formPeliculaId, setFormPeliculaId] = useState<number | ''>(''); // Usar '' para "no asignada"

    // Redireccionar si no es administrador
    useEffect(() => {
        if (!loading && (!user || user.tipo !== 'administrador')) {
            router.push('/dashboard'); // O a una página de acceso denegado
        }
    }, [loading, user, router]);

    const fetchSalasAndPeliculas = async () => {
        if (!token) return;
        setLoading(true);
        setError(null);
        try {
            // Fetch de Salas
            const salasResponse = await fetch('http://localhost:3001/salas', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!salasResponse.ok) {
                throw new Error(`Error al cargar salas: ${salasResponse.statusText}`);
            }
            const salasData: Sala[] = await salasResponse.json();
            setSalas(salasData);

            // Fetch de Películas (para el selector)
            const peliculasResponse = await fetch('http://localhost:3001/peliculas', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!peliculasResponse.ok) {
                throw new Error(`Error al cargar películas: ${peliculasResponse.statusText}`);
            }
            const peliculasData: Pelicula[] = await peliculasResponse.json();
            setPeliculas(peliculasData);

        } catch (err: any) {
            console.error('Error al cargar datos de administración de salas:', err);
            setError(err.message || 'Error al cargar los datos de administración.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token && user?.tipo === 'administrador') {
            fetchSalasAndPeliculas();
        } else if (!token) {
            setLoading(false);
            setError('No hay token de autenticación. Inicia sesión como administrador.');
        }
    }, [token, user]); // Dependencias para el useEffect

    // --- Manejo del Diálogo (Modal) ---
    const handleOpenCreate = () => {
        setIsEditing(false);
        setCurrentSala(null);
        setFormNombre('');
        setFormFilas('');
        setFormColumnas('');
        setFormPeliculaId(''); // Resetea a "no asignada"
        setOpenDialog(true);
    };

    const handleOpenEdit = (sala: Sala) => {
        setIsEditing(true);
        setCurrentSala(sala);
        setFormNombre(sala.nombre);
        setFormFilas(sala.filas);
        setFormColumnas(sala.columnas);
        setFormPeliculaId(sala.pelicula_id || ''); // Si es null, usa ''
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setError(null); // Limpiar errores del formulario al cerrar
        setSuccessMessage(null); // Limpiar mensajes de éxito
    };

    // --- Manejo del Formulario (Guardar) ---
    const handleSaveSala = async () => {
        if (!token) {
            setError('No autenticado.');
            return;
        }
        if (!formNombre || formFilas === '' || formColumnas === '') {
            setError('Todos los campos obligatorios deben ser llenados.');
            return;
        }

        const salaData = {
            nombre: formNombre,
            filas: Number(formFilas),
            columnas: Number(formColumnas),
            // Si formPeliculaId es '', enviamos null; de lo contrario, el número
            pelicula_id: formPeliculaId === '' ? null : Number(formPeliculaId)
        };

        try {
            let response;
            if (isEditing && currentSala?.id) {
                response = await fetch(`http://localhost:3001/salas/${currentSala.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(salaData)
                });
            } else {
                response = await fetch('http://localhost:3001/salas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(salaData)
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.mensaje || 'Error al guardar la sala.');
            }

            setSuccessMessage(isEditing ? 'Sala actualizada con éxito.' : 'Sala creada con éxito.');
            handleCloseDialog();
            fetchSalasAndPeliculas(); // Volver a cargar las salas
        } catch (err: any) {
            console.error('Error al guardar sala:', err);
            setError(err.message || 'Error desconocido al guardar la sala.');
        }
    };

    // --- Manejo de Eliminación ---
    const handleDeleteSala = async (id: number) => {
        if (!token) {
            setError('No autenticado.');
            return;
        }

        if (!window.confirm('¿Estás seguro de que quieres eliminar esta sala?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/salas/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.mensaje || 'Error al eliminar la sala.');
            }

            setSuccessMessage('Sala eliminada con éxito.');
            fetchSalasAndPeliculas(); // Volver a cargar las salas
        } catch (err: any) {
            console.error('Error al eliminar sala:', err);
            setError(err.message || 'Error desconocido al eliminar la sala.');
        }
    };

    if (loading) {
        return (
            <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Cargando salas...</Typography>
            </Container>
        );
    }

    if (error && (!user || user.tipo !== 'administrador')) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    // Si el usuario no es admin y ya terminó de cargar, redirigir
    if (user && user.tipo !== 'administrador') {
        return null; // El useEffect ya se encarga de la redirección
    }

    return (
        <Container sx={{ mt: 4, mb: 4 }} maxWidth={false}> {/* ¡Container a full width! */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Administración de Salas
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpenCreate}
                >
                    Crear Sala
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

            {salas.length === 0 ? (
                <Typography>No hay salas registradas.</Typography>
            ) : (
                <TableContainer component={Paper}> {/* Contenedor de la tabla */}
                    <Table aria-label="tabla de salas">
                        <TableHead>
                            <TableRow>
                                {/* Celdas de encabezado con anchos controlados */}
                                <TableCell sx={{ width: '5%', minWidth: '50px' }}>ID</TableCell>
                                <TableCell sx={{ width: '20%', minWidth: '150px' }}>Nombre</TableCell>
                                <TableCell sx={{ width: '15%', minWidth: '100px' }}>Filas</TableCell>
                                <TableCell sx={{ width: '15%', minWidth: '100px' }}>Columnas</TableCell>
                                <TableCell sx={{ width: '15%', minWidth: '120px' }}>Capacidad</TableCell>
                                {/* Película asignada: tomará el espacio restante */}
                                <TableCell sx={{ width: 'auto' }}>Película Asignada</TableCell>
                                {/* Acciones al final con un ancho fijo */}
                                <TableCell sx={{ width: '15%', minWidth: '100px' }} align="right">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {salas.map((sala) => (
                                <TableRow key={sala.id}>
                                    <TableCell>{sala.id}</TableCell>
                                    <TableCell>{sala.nombre}</TableCell>
                                    <TableCell>{sala.filas}</TableCell>
                                    <TableCell>{sala.columnas}</TableCell>
                                    <TableCell>{sala.filas * sala.columnas}</TableCell>
                                    <TableCell>
                                        {sala.pelicula?.nombre || 'Ninguna'}
                                    </TableCell>
                                    <TableCell align="right">
                                        {/* Botones de acción (lápiz y basura) */}
                                        <IconButton color="primary" onClick={() => handleOpenEdit(sala)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDeleteSala(sala.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Diálogo de Crear/Editar Sala (se mantiene sin cambios) */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>{isEditing ? 'Editar Sala' : 'Crear Nueva Sala'}</DialogTitle>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <TextField
                        autoFocus
                        margin="dense"
                        id="nombre"
                        label="Nombre de la Sala"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formNombre}
                        onChange={(e) => setFormNombre(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        id="filas"
                        label="Número de Filas"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={formFilas}
                        onChange={(e) => setFormFilas(Number(e.target.value))}
                        inputProps={{ min: 1 }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        id="columnas"
                        label="Número de Columnas"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={formColumnas}
                        onChange={(e) => setFormColumnas(Number(e.target.value))}
                        inputProps={{ min: 1 }}
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                        <InputLabel id="pelicula-select-label">Película Asignada</InputLabel>
                        <Select
                            labelId="pelicula-select-label"
                            id="pelicula_id"
                            value={formPeliculaId}
                            label="Película Asignada"
                            onChange={(e) => setFormPeliculaId(e.target.value as number | '')}
                        >
                            <MenuItem value="">
                                <em>Ninguna (Desasignar)</em>
                            </MenuItem>
                            {/* Asegúrate de que `peliculas` esté cargado para que esto funcione */}
                            {peliculas.map((pelicula) => (
                                <MenuItem key={pelicula.id} value={pelicula.id}>
                                    {pelicula.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancelar
                    </Button>
                    <Button onClick={handleSaveSala} color="primary" variant="contained">
                        {isEditing ? 'Guardar Cambios' : 'Crear Sala'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminSalasPage;
