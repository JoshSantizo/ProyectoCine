const reservacionModel = require('../models/reservacion');

async function crearReservacion(req, res) {
    try {
        const { usuario_id, sala_id, fecha, asientos, codigo_qr, nombre_tarjeta, numero_tarjeta, cvv, fecha_expiracion } = req.body;
        const reservacionId = await reservacionModel.crearReservacion(usuario_id, sala_id, fecha, asientos, codigo_qr, nombre_tarjeta, numero_tarjeta, cvv, fecha_expiracion);
        res.status(201).json({ id: reservacionId, mensaje: 'Reservacion creada exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear la reservacion', error: error.message });
    }
}

async function obtenerReservacionPorId(req, res) {
    try {
        const { id } = req.params;
        const reservacion = await reservacionModel.obtenerReservacionPorId(id);
        if (reservacion) {
            res.status(200).json(reservacion);
        } else {
            res.status(404).json({ mensaje: 'Reservacion no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener la reservacion', error: error.message });
    }
}

async function actualizarEstadoReservacion(req, res) {
    try {
        const { id } = req.params;
        const { estado } = req.body; 
        const actualizado = await reservacionModel.actualizarEstadoReservacion(id, estado);
        if (actualizado) {
            res.status(200).json({ mensaje: 'Estado de la reservacion actualizado exitosamente' });
        } else {
            res.status(404).json({ mensaje: 'Reservacion no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el estado de la reservacion', error: error.message });
    }
}

module.exports = {
    crearReservacion,
    obtenerReservacionPorId,
    actualizarEstadoReservacion
};