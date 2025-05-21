// backend/controllers/auth.js
const bcrypt = require('bcryptjs'); // Para encriptar y comparar contraseñas
const jwt = require('jsonwebtoken'); // Para generar tokens JWT
const Usuario = require('../models/usuario'); // Importa el modelo Usuario de Sequelize

// Asegúrate de que JWT_SECRET esté en tu archivo .env
const JWT_SECRET = process.env.JWT_SECRET || 'super_secreto_para_desarrollo_cambiar_en_produccion'; 

const authController = {
    // Controlador para el registro de un nuevo usuario
    async register(req, res) {
        const { nombre, username, contrasena } = req.body; 

        if (!nombre || !username || !contrasena) { 
            return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
        }

        try {
            // Verificar si el username ya existe
            const existingUser = await Usuario.findOne({ where: { username } }); 

            if (existingUser) {
                return res.status(409).json({ mensaje: 'El nombre de usuario ya está en uso.' });
            }

            // Encriptar la contraseña
            const hashedPassword = await bcrypt.hash(contrasena, 10); 

            // Crear el nuevo usuario en la DB usando Sequelize
            const newUser = await Usuario.create({
                nombre,
                username,
                contrasena: hashedPassword,
                tipo: 'cliente', // Por defecto 'cliente'
            });

            // Generar un token JWT para el nuevo usuario
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
            // Manejar error de restricción única para username duplicado
            if (error.name === 'SequelizeUniqueConstraintError') {
                 return res.status(409).json({ mensaje: 'El nombre de usuario ya está en uso.' });
            }
            res.status(500).json({ mensaje: 'Error interno del servidor al registrar usuario.' });
        }
    },

    // Controlador para el inicio de sesión
    async login(req, res) {
        const { username, contrasena } = req.body; 

        if (!username || !contrasena) { 
            return res.status(400).json({ mensaje: 'Nombre de usuario y contraseña son obligatorios.' });
        }

        try {
            // Buscar el usuario por 'username'
            const user = await Usuario.findOne({ where: { username } });

            if (!user) {
                return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
            }

            // Comparar la contraseña encriptada
            const isMatch = await bcrypt.compare(contrasena, user.contrasena); 

            if (!isMatch) {
                return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
            }

            // Generar un token JWT
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