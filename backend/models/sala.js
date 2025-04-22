const pool = require('../config/db');

async function crearSala(nombre, pelicula_id, filas, columnas) {
    try {
        const [result] = await pool.query(
            'INSERT INTO sala (nombre, pelicula_id, filas, columnas) VALUES (?, ?, ?, ?)',
            [nombre, pelicula_id, filas, columnas]
        );
        return result.insertId;
    } catch (error) {
        console.error('Error al crear sala:', error);
        throw error;
    }
}

async function obtenerSalas() {
    try {
        const [rows] = await pool.query('SELECT * FROM sala');
        return rows;
    } catch (error) {
        console.error('Error al obtener salas:', error);
        throw error;
    }
}

async function obtenerSalaPorId(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM sala WHERE id = ?', [id]);
        return rows[0];
    } catch (error) {
        console.error('Error al obtener sala por ID:', error);
        throw error;
    }
}

async function actualizarSala(id, nombre, pelicula_id, filas, columnas) {
    try {
        const [result] = await pool.query(
            'UPDATE sala SET nombre = ?, pelicula_id = ?, filas = ?, columnas = ? WHERE id = ?',
            [nombre, pelicula_id, filas, columnas, id]
        );
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al actualizar sala:', error);
        throw error;
    }
}

async function eliminarSala(id) {
    try {
        const [result] = await pool.query('DELETE FROM sala WHERE id = ?', [id]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al eliminar sala:', error);
        throw error;
    }
}

module.exports = {
    crearSala,
    obtenerSalas,
    obtenerSalaPorId,
    actualizarSala,
    eliminarSala
};
