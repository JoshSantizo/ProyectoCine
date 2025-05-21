// backend/models/reservacion.js
const db = require('../config/db'); // Ruta correcta al archivo de conexión

const Reservacion = {
    async create({ usuario_id, sala_id, fecha, asientos, codigo_qr, nombre_tarjeta, numero_tarjeta, cvv, fecha_expiracion, estado = 'confirmado' }) {
        const query = `
            INSERT INTO reservacion 
            (usuario_id, sala_id, fecha, asientos, codigo_qr, nombre_tarjeta, numero_tarjeta, cvv, fecha_expiracion, estado) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [
            usuario_id,
            sala_id,
            fecha, 
            JSON.stringify(asientos), // Guardar los asientos como string JSON
            codigo_qr,
            nombre_tarjeta,
            numero_tarjeta,
            cvv,
            fecha_expiracion, 
            estado,
        ]);
        return { 
            id: result.insertId, 
            usuario_id, 
            sala_id, 
            fecha, 
            asientos, 
            codigo_qr, 
            nombre_tarjeta, 
            numero_tarjeta, 
            cvv, 
            fecha_expiracion, 
            estado 
        };
    },

    async findById(id) {
        const query = 'SELECT * FROM reservacion WHERE id = ?';
        const [rows] = await db.execute(query, [id]);
        if (rows[0] && rows[0].asientos) {
            rows[0].asientos = JSON.parse(rows[0].asientos); 
        }
        return rows[0] || null;
    },

    async findConfirmedBySalaAndFecha(salaId, fecha) {
        const query = `
            SELECT r.asientos
            FROM reservacion r
            WHERE r.sala_id = ? AND r.fecha = ? AND r.estado = 'confirmado'
        `;
        const [rows] = await db.execute(query, [salaId, fecha]);
        const allReservedButacas = [];
        rows.forEach(row => {
            if (row.asientos) {
                try {
                    const butacas = JSON.parse(row.asientos);
                    allReservedButacas.push(...butacas);
                } catch (e) {
                    console.error("Error parsing asientos JSON:", row.asientos, e);
                }
            }
        });
        return allReservedButacas;
    },
};

module.exports = Reservacion;