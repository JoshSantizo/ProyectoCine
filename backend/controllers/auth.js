const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const dotenv = require('dotenv'); 
dotenv.config(); 

const JWT_SECRET = process.env.JWT_SECRET || 'holamundo';

const authController = {
    async register(req, res) {
        const { nombre, username, contrasena } = req.body;

        if (!nombre || !username || !contrasena) {
            return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
        }

        try {
            const existingUser = await Usuario.findOne({ where: { username } });

            if (existingUser) {
                return res.status(409).json({ mensaje: 'El nombre de usuario ya está en uso.' });
            }

            const hashedPassword = await bcrypt.hash(contrasena, 10);

            const newUser = await Usuario.create({
                nombre,
                username,
                contrasena: hashedPassword,
                tipo: 'cliente', 
            });

            const token = jwt.sign(
                { id: newUser.id, username: newUser.username, tipo: newUser.tipo },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(201).json({
                mensaje: 'Registro exitoso.',
                token,
                userId: newUser.id,
                username: newUser.username,
                tipo: newUser.tipo
            });

        } catch (error) {
            console.error('Error en el registro de usuario:', error);
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(409).json({ mensaje: 'El nombre de usuario ya está en uso.' });
            }
            res.status(500).json({ mensaje: 'Error interno del servidor al registrar usuario.' });
        }
    },

    async login(req, res) {
        const { username, contrasena } = req.body;

        if (!username || !contrasena) {
            return res.status(400).json({ mensaje: 'Nombre de usuario y contraseña son obligatorios.' });
        }

        try {
            const user = await Usuario.findOne({ where: { username } });

            if (!user) {
                return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
            }

            const isMatch = await bcrypt.compare(contrasena, user.contrasena);

            if (!isMatch) {
                return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
            }

            const token = jwt.sign(
                { id: user.id, username: user.username, tipo: user.tipo },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).json({
                mensaje: 'Inicio de sesión exitoso',
                token,
                userId: user.id,
                username: user.username,
                tipo: user.tipo
            });

        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor al iniciar sesión.' });
        }
    }
};

module.exports = authController;
