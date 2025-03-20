const pool = require('../config/db');
const bcrypt = require('bcryptjs');

async function crearUsuario(nombre, username, contrasena, tipo = 'cliente') {
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const [result] = await pool.query(
        'INSERT INTO usuario (nombre, username, contrasena, tipo) VALUES (?, ?, ?, ?)',
        [nombre, username, hashedPassword, tipo]
    );
    return result.insertId;
}

async function obtenerUsuarioPorUsername(username) {
    const [rows] = await pool.query('SELECT * FROM usuario WHERE username = ?', [username]);
    return rows[0];
}

module.exports = {
    crearUsuario,
    obtenerUsuarioPorUsername
};