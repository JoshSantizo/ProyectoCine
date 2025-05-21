'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Container, Typography, Box, Button, Grid, Paper, Alert, CircularProgress,
    TextField, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useParams, useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/layout';

// Interfaz para la película
interface Pelicula {
    id: number;
    nombre: string;
    duracion: number;
    imagen: string;
}

// Interfaz para la sala
interface Sala {
    id: number;
    nombre: string;
    filas: number;
    columnas: number;
    pelicula_id: number | null;
}

// Interfaz para los datos de la reserva
interface ReservaPayload {
    usuario_id: number;
    sala_id: number;
    fecha: string; 
    asientos: { fila: number; columna: number }[];
    nombre_tarjeta: string;
    numero_tarjeta: string;
    cvv: string;
    fecha_expiracion: string; 
}

// Para el resumen de la reserva
interface ReservaResumen extends ReservaPayload {
    id: number;
    sala_nombre: string;
    pelicula_nombre: string;
    total_asientos: number;
}

const ReservacionesPage = () => {
    const { movieId } = useParams<{ movieId: string }>();
    const { user, token } = useAuthContext();
    const router = useRouter();

    const [pelicula, setPelicula] = useState<Pelicula | null>(null);
    const [salaSeleccionada, setSalaSeleccionada] = useState<Sala | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Asientos ocupados
    const [occupiedSeats, setOccupiedSeats] = useState<Set<string>>(new Set());

    // selección de asientos 
    const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set()); // Almacena "fila-columna"

    // Estado para la fecha de reserva
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

    // Estado para los datos de pago
    const [paymentDetails, setPaymentDetails] = useState({
        nombre_tarjeta: '',
        numero_tarjeta: '',
        cvv: '',
        fecha_expiracion: '',
    });

    // Estado para el resumen de la reserva
    const [openSummaryDialog, setOpenSummaryDialog] = useState(false);
    const [reservationSummary, setReservationSummary] = useState<ReservaResumen | null>(null);

   
    const generateOccupiedSeats = useCallback((date: Dayjs) => {
        const occupied: Set<string> = new Set();
        const dateString = date.format('YYYY-MM-DD');

        if (dateString === dayjs().format('YYYY-MM-DD')) { 
            occupied.add("0-0");
            occupied.add("0-1");
            occupied.add("1-5");
            occupied.add("2-3");
        } else if (date.day() === 5) { 
            occupied.add("0-0");
            occupied.add("0-1");
            occupied.add("0-2");
            occupied.add("1-0");
            occupied.add("1-1");
            occupied.add("2-0");
        } else if (date.day() === 6 || date.day() === 0) { 
            occupied.add("0-0");
            occupied.add("0-1");
            occupied.add("0-2");
            occupied.add("0-3");
            occupied.add("0-4");
            occupied.add("1-0");
            occupied.add("1-1");
            occupied.add("1-2");
            occupied.add("1-3");
            occupied.add("2-0");
            occupied.add("2-1");
        } else { // Otros días
            occupied.add("0-0");
            occupied.add("1-1");
            occupied.add("2-2");
            occupied.add("3-3");
        }
        return occupied;
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!token || !user) {
                setError('Necesitas iniciar sesión para hacer reservaciones.');
                setLoading(false);
                router.push('/login');
                return;
            }

            if (!movieId) {
                setError('ID de película no proporcionado.');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                // 1. Obtener detalles de la película
                const movieRes = await fetch(`http://localhost:3001/peliculas/${movieId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!movieRes.ok) {
                    throw new Error('Película no encontrada o error al cargar.');
                }
                const movieData: Pelicula = await movieRes.json();
                setPelicula(movieData);

                // 2. Obtener una sala
                const salasRes = await fetch('http://localhost:3001/salas', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!salasRes.ok) {
                    throw new Error('Error al cargar salas.');
                }
                const allSalas: Sala[] = await salasRes.json();
                const salaEncontrada = allSalas.find(s => s.pelicula_id === Number(movieId));

                if (salaEncontrada) {
                    setSalaSeleccionada(salaEncontrada);
                } else {
                    if (allSalas.length > 0) {
                        setSalaSeleccionada(allSalas[0]);
                        console.warn('No se encontró una sala directamente asignada a esta película. Usando la primera sala disponible para la demostración.');
                    } else {
                        setError('No se encontraron salas para esta película ni otras disponibles.');
                    }
                }
            } catch (err: any) {
                console.error('Error al cargar datos de reservación:', err);
                setError(err.message || 'Error al cargar los datos necesarios para la reservación.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [movieId, token, user, router]);

    useEffect(() => {
        if (selectedDate) {
            const newOccupiedSeats = generateOccupiedSeats(selectedDate);
            setOccupiedSeats(newOccupiedSeats);
            setSelectedSeats(new Set()); 
        } else {
            setOccupiedSeats(new Set()); 
        }
    }, [selectedDate, generateOccupiedSeats]);


  
    const handleSeatClick = useCallback((fila: number, columna: number) => {
        const seatKey = `${fila}-${columna}`;

        if (occupiedSeats.has(seatKey)) {
            return;
        }

        setSelectedSeats((prev) => {
            const newSeats = new Set(prev);
            if (newSeats.has(seatKey)) {
                newSeats.delete(seatKey);
            } else {
                newSeats.add(seatKey);
            }
            return newSeats;
        });
    }, [occupiedSeats]);

    // Dibujar los asientos
    const renderSeats = useCallback(() => {
        if (!salaSeleccionada) return null;

        const { filas, columnas } = salaSeleccionada;
        const seatGrid = [];

        for (let i = 0; i < filas; i++) {
            const row = [];
            for (let j = 0; j < columnas; j++) {
                const seatKey = `${i}-${j}`;
                const isSelected = selectedSeats.has(seatKey);
                const isOccupied = occupiedSeats.has(seatKey);

                row.push(
                    <Box
                        key={seatKey}
                        sx={{
                            width: 30,
                            height: 30,
                            borderRadius: 1,
                            backgroundColor: !selectedDate ? 'common.white' : (isOccupied ? 'error.main' : (isSelected ? 'success.main' : 'primary.main')),
                            cursor: !selectedDate || isOccupied ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: !selectedDate ? 'text.secondary' : 'white',
                            fontWeight: 'bold',
                            fontSize: '0.7rem',
                            opacity: !selectedDate ? 0.4 : (isOccupied ? 0.6 : 1), 
                            '&:hover': {
                                opacity: !selectedDate || isOccupied ? (isOccupied ? 0.6 : 0.4) : 0.8,
                            },
                            pointerEvents: !selectedDate || isOccupied ? 'none' : 'auto',
                            border: !selectedDate ? '1px dashed grey' : 'none' 
                        }}
                        onClick={() => handleSeatClick(i, j)}
                    >
                        {j + 1}
                    </Box>
                );
            }
            seatGrid.push(
                <Box key={`row-${i}`} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Typography variant="caption" sx={{ width: 20, textAlign: 'right' }}>
                        {String.fromCharCode(65 + i)}
                    </Typography>
                    {row}
                </Box>
            );
        }
        return seatGrid;
    }, [salaSeleccionada, selectedSeats, occupiedSeats, handleSeatClick, selectedDate]); 


   
    const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPaymentDetails((prev) => ({ ...prev, [name]: value }));
    };

    
    const validateExpiryDate = (dateString: string) => {
        const pattern = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/; 
        return pattern.test(dateString);
    };

    // Proceso de reservación
    const handleReservation = async () => {
        setError(null);
        if (!pelicula || !salaSeleccionada || !user) {
            setError('Faltan datos de película, sala o usuario. Intenta recargar la página.');
            return;
        }
        if (selectedSeats.size === 0) {
            setError('Por favor, selecciona al menos un asiento.');
            return;
        }
        if (!selectedDate) {
            setError('Por favor, selecciona una fecha para la reserva.');
            return;
        }
        if (!paymentDetails.nombre_tarjeta || !paymentDetails.numero_tarjeta || !paymentDetails.cvv || !paymentDetails.fecha_expiracion) {
            setError('Por favor, completa todos los datos de pago.');
            return;
        }
        if (!validateExpiryDate(paymentDetails.fecha_expiracion)) {
            setError('Formato de fecha de expiración incorrecto (MM/AA).');
            return;
        }
        if (paymentDetails.numero_tarjeta.length < 16) {
             setError('El número de tarjeta debe tener 16 dígitos.');
             return;
        }
        if (paymentDetails.cvv.length < 3 || paymentDetails.cvv.length > 4) {
            setError('El CVV debe tener 3 o 4 dígitos.');
            return;
        }

        setLoading(true);

        const asientosArray = Array.from(selectedSeats).map((seatKey) => {
            const [fila, columna] = seatKey.split('-').map(Number);
            return { fila, columna };
        });

        const reservaPayload: ReservaPayload = {
            usuario_id: user.id,
            sala_id: salaSeleccionada.id,
            fecha: selectedDate.format('YYYY-MM-DD'),
            asientos: asientosArray,
            nombre_tarjeta: paymentDetails.nombre_tarjeta,
            numero_tarjeta: paymentDetails.numero_tarjeta,
            cvv: paymentDetails.cvv,
            fecha_expiracion: paymentDetails.fecha_expiracion,
        };

        try {
            const response = await fetch('http://localhost:3001/reservaciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(reservaPayload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.mensaje || 'Error al realizar la reserva.');
            }

            const data = await response.json();
            setReservationSummary({
                ...reservaPayload,
                id: data.id,
                sala_nombre: salaSeleccionada.nombre,
                pelicula_nombre: pelicula.nombre,
                total_asientos: asientosArray.length,
            });
            setOpenSummaryDialog(true);
            setSelectedSeats(new Set()); 
            setPaymentDetails({ 
                nombre_tarjeta: '',
                numero_tarjeta: '',
                cvv: '',
                fecha_expiracion: '',
            });

        } catch (err: any) {
            console.error('Error durante la reservación:', err);
            setError(err.message || 'Error desconocido al procesar la reserva.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>Cargando detalles de la película y sala...</Typography>
            </Container>
        );
    }

    if (error && (!user || !token)) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
                <Button onClick={() => router.push('/login')} sx={{ mt: 2 }}>Ir a Iniciar Sesión</Button>
            </Container>
        );
    }

    if (!pelicula || !salaSeleccionada) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="warning">No se pudo encontrar la película o la sala asociada.</Alert>
                <Button onClick={() => router.push('/dashboard')} sx={{ mt: 2 }}>Volver al Dashboard</Button>
            </Container>
        );
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Container sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Reservar Boletos para: {pelicula.nombre}
                </Typography>
                <Typography variant="h6" align="center" color="text.secondary" gutterBottom>
                    Sala: {salaSeleccionada.nombre} ({salaSeleccionada.filas}x{salaSeleccionada.columnas})
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h6" gutterBottom>Selecciona tu Fecha</Typography>
                    <DatePicker
                        label="Fecha de Reserva"
                        value={selectedDate}
                        onChange={(newValue) => setSelectedDate(newValue)}
                        minDate={dayjs()}
                        maxDate={dayjs().add(8, 'day')}
                        sx={{ mb: 3 }}
                    />
                </Paper>

                <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Selecciona tus Asientos (Total: {selectedSeats.size})
                        {!selectedDate && <Typography variant="caption" display="block" color="text.secondary">
                            Selecciona una fecha para ver la disponibilidad de asientos.
                        </Typography>}
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mb: 3,
                        p: 2,
                        border: '1px dashed grey',
                        borderRadius: 2
                    }}>
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>Pantalla</Typography>
                        <Box sx={{
                            width: '80%',
                            height: 10,
                            backgroundColor: 'text.secondary',
                            borderRadius: 1,
                            mb: 3
                        }} />
                        {renderSeats()}
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                            {!selectedDate && (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box sx={{ width: 20, height: 20, backgroundColor: 'common.white', border: '1px dashed grey', borderRadius: 1, mr: 1 }} />
                                    <Typography variant="caption">Seleccionar Fecha</Typography>
                                </Box>
                            )}
                            {selectedDate && (
                                <>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box sx={{ width: 20, height: 20, backgroundColor: 'primary.main', borderRadius: 1, mr: 1 }} />
                                        <Typography variant="caption">Disponible</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box sx={{ width: 20, height: 20, backgroundColor: 'success.main', borderRadius: 1, mr: 1 }} />
                                        <Typography variant="caption">Seleccionado</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box sx={{ width: 20, height: 20, backgroundColor: 'error.main', borderRadius: 1, mr: 1 }} />
                                        <Typography variant="caption">Ocupado</Typography>
                                    </Box>
                                </>
                            )}
                        </Box>
                    </Box>
                </Paper>

                <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h6" gutterBottom>Datos de Pago</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Nombre en la Tarjeta"
                                name="nombre_tarjeta"
                                fullWidth
                                value={paymentDetails.nombre_tarjeta}
                                onChange={handlePaymentChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Número de Tarjeta"
                                name="numero_tarjeta"
                                fullWidth
                                value={paymentDetails.numero_tarjeta}
                                onChange={handlePaymentChange}
                                inputProps={{ maxLength: 16 }}
                                required
                            />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <TextField
                                label="CVV"
                                name="cvv"
                                fullWidth
                                value={paymentDetails.cvv}
                                onChange={handlePaymentChange}
                                inputProps={{ maxLength: 4 }}
                                required
                            />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <TextField
                                label="Fecha Exp. (MM/AA)"
                                name="fecha_expiracion"
                                fullWidth
                                value={paymentDetails.fecha_expiracion}
                                onChange={handlePaymentChange}
                                placeholder="MM/AA"
                                inputProps={{ maxLength: 5 }}
                                required
                            />
                        </Grid>
                    </Grid>
                </Paper>

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    onClick={handleReservation}
                    disabled={loading || !selectedDate || selectedSeats.size === 0} // Deshabilitar si no hay fecha o asientos seleccionados
                    sx={{ mb: 2 }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : `Confirmar Reserva (${selectedSeats.size * 10})`}
                </Button>

                {/* Diálogo de Resumen de la Reserva */}
                <Dialog open={openSummaryDialog} onClose={() => setOpenSummaryDialog(false)}>
                    <DialogTitle>Resumen de tu Reserva</DialogTitle>
                    <DialogContent>
                        {reservationSummary && (
                            <Box>
                                <Typography variant="h6" gutterBottom>¡Reserva Exitosa!</Typography>
                                <Typography><strong>Reserva ID:</strong> {reservationSummary.id}</Typography>
                                <Typography><strong>Película:</strong> {reservationSummary.pelicula_nombre}</Typography>
                                <Typography><strong>Sala:</strong> {reservationSummary.sala_nombre}</Typography>
                                <Typography><strong>Fecha:</strong> {dayjs(reservationSummary.fecha).format('DD/MM/YYYY')}</Typography>
                                <Typography><strong>Asientos:</strong> {reservationSummary.asientos.map(a => `${String.fromCharCode(65 + a.fila)}${a.columna + 1}`).join(', ')}</Typography>
                                <Typography><strong>Total Asientos:</strong> {reservationSummary.total_asientos}</Typography>
                                <Typography sx={{ mt: 2 }}>¡Disfruta tu función!</Typography>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { setOpenSummaryDialog(false); router.push('/dashboard'); }}>
                            Cerrar y Volver al Dashboard
                        </Button>
                    </DialogActions>
                </Dialog>

            </Container>
        </LocalizationProvider>
    );
};

export default ReservacionesPage;
