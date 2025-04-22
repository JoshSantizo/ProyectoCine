const pool = require('../config/db');

async function crearReservacion(usuario_id, sala_id, fecha, asientos, codigo_qr, nombre_tarjeta, numero_tarjeta, cvv, fecha_expiracion) {
    try {
        const [result] = await pool.query(
            'INSERT INTO reservacion (usuario_id, sala_id, fecha, asientos, codigo_qr, nombre_tarjeta, numero_tarjeta, cvv, fecha_expiracion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [usuario_id, sala_id, fecha, asientos, codigo_qr, nombre_tarjeta, numero_tarjeta, cvv, fecha_expiracion]
        );
        return result.insertId;
    } catch (error) {
        console.error('Error al crear reservacion:', error);
        throw error;
    }
}

async function obtenerReservacionPorId(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM reservacion WHERE id = ?', [id]);
        return rows[0];
    } catch (error) {
        console.error('Error al obtener reservacion por ID:', error);
        throw error;
    }
}

async function actualizarEstadoReservacion(id, nuevoEstado) {
    try {
        const [result] = await pool.query(
            'UPDATE reservacion SET estado = ? WHERE id = ?',
            [nuevoEstado, id]
        );
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al actualizar el estado de la reservacion:', error);
        throw error;
    }
}


module.exports = {
    crearReservacion,
    obtenerReservacionPorId,
    actualizarEstadoReservacion
};