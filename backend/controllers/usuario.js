const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 
const Usuario = require('../models/usuario'); 

const JWT_SECRET = process.env.JWT_SECRET; 

const usuarioController = {
    // Función para el login de usuarios
    async loginUsuario(req, res) {
        const { username, contrasena } = req.body; 

        if (!username || !contrasena) {
            return res.status(400).json({ mensaje: 'Usuario y contraseña son requeridos.' });
        }

        try {
            const user = await Usuario.findByUsername(username); 

            if (!user) {
                return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
            }

            const isMatch = await bcrypt.compare(contrasena, user.contrasena);

            if (!isMatch) {
                return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
            }

            // Generar el JWT
            const payload = {
                id: user.id, 
                username: user.nombre_usuario 
            };
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); 

            res.status(200).json({ token }); 

        } catch (error) {
            console.error('Error en loginUsuario:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor al iniciar sesión.' });
        }
    },

    // Función para registrar usuarios
    async registerUsuario(req, res) {
        const { username, contrasena, email } = req.body; 

        if (!username || !contrasena || !email) {
            return res.status(400).json({ mensaje: 'Todos los campos son requeridos.' });
        }

        try {
            const existingUser = await Usuario.findByUsername(username); 
            if (existingUser) {
                return res.status(409).json({ mensaje: 'El nombre de usuario ya está registrado.' });
            }

            const hashedPassword = await bcrypt.hash(contrasena, 10); 

            const newUser = await Usuario.create(username, hashedPassword, email); 

            res.status(201).json({ mensaje: 'Usuario registrado con éxito', usuarioId: newUser.id });
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor al registrar el usuario.' });
        }
    }
};

module.exports = usuarioController; 