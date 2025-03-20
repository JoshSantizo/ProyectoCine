const usuarioModel = require('../models/usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function registro(req, res) {
    try {
        const { nombre, username, contrasena } = req.body;
        const usuarioId = await usuarioModel.crearUsuario(nombre, username, contrasena);
        res.status(201).json({ mensaje: 'Usuario creado con éxito', id: usuarioId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al crear el usuario' });
    }
}

async function login(req, res) {
    try {
        const { username, contrasena } = req.body;
        const usuario = await usuarioModel.obtenerUsuarioPorUsername(username);
        if (!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }
        const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!contrasenaValida) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }
        const token = jwt.sign(
            { id: usuario.id, tipo: usuario.tipo },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al iniciar sesión' });
    }
}

module.exports = {
    registro,
    login
};
