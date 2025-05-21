// backend/models/butaca.js
const db = require('../config/db'); // Ruta correcta al archivo de conexión

const Butaca = {
    async findBySalaId(salaId) {
        const query = `SELECT id, sala_id, fila, columna, estado FROM butaca WHERE sala_id = ? ORDER BY fila, columna`;
        const [rows] = await db.execute(query, [salaId]);
        return rows;
    },
    async create({ sala_id, fila, columna, estado = 'disponible' }) {
        const query = `INSERT INTO butaca (sala_id, fila, columna, estado) VALUES (?, ?, ?, ?)`;
        const [result] = await db.execute(query, [sala_id, fila, columna, estado]);
        return { id: result.insertId, sala_id, fila, columna, estado };
    }
};

module.exports = Butaca;