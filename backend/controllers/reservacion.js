// backend/controllers/reservacion.js
const Reservacion = require('../models/reservacion'); // Ruta correcta al modelo
const Butaca = require('../models/butaca'); // Ruta correcta al modelo
const Sala = require('../models/sala'); // Ruta correcta al modelo
const QRCode = require('qrcode'); // Asegúrate de tener 'qrcode' instalado: npm install qrcode
const { v4: uuidv4 } = require('uuid'); // Asegúrate de tener 'uuid' instalado: npm install uuid

const reservacionController = {
    async createReservacion(req, res) {
        try {
            // usuario_id viene del payload del token (definido en authMiddleware.js)
            const usuario_id = req.user.id; 

            const {
                sala_id,
                fecha, 
                butacas_seleccionadas, 
                nombre_tarjeta,
                numero_tarjeta,
                cvv,
                fecha_expiracion,
            } = req.body;

            // --- Validaciones de entrada ---
            if (!usuario_id || !sala_id || !fecha || !butacas_seleccionadas || butacas_seleccionadas.length === 0 ||
                !nombre_tarjeta || !numero_tarjeta || !cvv || !fecha_expiracion) {
                return res.status(400).json({ mensaje: 'Datos de reserva incompletos.' });
            }

            const sala = await Sala.findById(sala_id);
            if (!sala) {
                return res.status(404).json({ mensaje: 'Sala no encontrada.' });
            }

            // Validar que la fecha esté en el rango permitido
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0); 
            const fechaReserva = new Date(fecha);
            fechaReserva.setHours(0, 0, 0, 0); 
            
            const diffTime = Math.abs(fechaReserva.getTime() - hoy.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (fechaReserva < hoy || diffDays > 7) { 
                return res.status(400).json({ mensaje: 'La fecha de reserva debe ser hoy o en los próximos 7 días.' });
            }

            // --- Verificación de disponibilidad de butacas (¡Doble chequeo para evitar race conditions!) ---
            const todasLasButacasDeSala = await Butaca.findBySalaId(sala_id);
            const butacasFisicasMap = new Map(); 
            todasLasButacasDeSala.forEach(b => butacasFisicasMap.set(`${b.fila}-${b.columna}`, b.id));

            const asientosReservadosParaFecha = await Reservacion.findConfirmedBySalaAndFecha(sala_id, fecha);
            const reservedKeys = new Set(asientosReservadosParaFecha.map(b => `${b.fila}-${b.columna}`));

            for (const b of butacas_seleccionadas) {
                const key = `${b.fila}-${b.columna}`;
                if (!butacasFisicasMap.has(key)) {
                    return res.status(400).json({ mensaje: `Butaca ${b.fila}-${b.columna} no existe en la sala.` });
                }
                if (reservedKeys.has(key)) {
                    return res.status(409).json({ mensaje: `Butaca ${b.fila}-${b.columna} ya está reservada para esta fecha.` });
                }
            }

            // --- Generación de QR ---
            const reserva_uuid = uuidv4(); 
            const qrData = JSON.stringify({
                reservaId: reserva_uuid,
                sala: sala.nombre,
                fecha,
                butacas: butacas_seleccionadas,
                usuario_id: usuario_id 
            });
            const codigo_qr_base64 = await QRCode.toDataURL(qrData);

            // --- Crear la reservación ---
            const nuevaReserva = await Reservacion.create({
                usuario_id,
                sala_id,
                fecha,
                asientos: butacas_seleccionadas, 
                codigo_qr: codigo_qr_base64,
                nombre_tarjeta,
                numero_tarjeta,
                cvv,
                fecha_expiracion,
                estado: 'confirmado',
            });

            res.status(201).json({
                mensaje: 'Reserva creada con éxito.',
                reserva: {
                    id: nuevaReserva.id,
                    usuario_id: nuevaReserva.usuario_id,
                    sala_id: nuevaReserva.sala_id,
                    fecha: nuevaReserva.fecha,
                    asientos: butacas_seleccionadas, 
                    codigo_qr: nuevaReserva.codigo_qr,
                    estado: nuevaReserva.estado,
                },
                codigo_qr_imagen: codigo_qr_base64, 
            });

        } catch (error) {
            console.error('Error al crear reservación:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor.' });
        }
    },
};

module.exports = reservacionController;