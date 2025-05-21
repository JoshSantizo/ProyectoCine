const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const Reservacion = require('../models/reservacion');
const Usuario = require('../models/usuario'); 
const Sala = require('../models/sala'); 

const JWT_SECRET = process.env.JWT_SECRET || 'holamundo'; 

// Middleware para verificar el token JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); 

    jwt.verify(token, JWT_SECRET, (err, user) => { 
        if (err) {
            console.error('JWT verification error:', err);
            return res.status(403).json({ mensaje: 'Token inválido o expirado.', error: err.message });
        }
        req.user = user; 
        next();
    });
};

// Ruta POST para crear una nueva reserva
router.post('/', authenticateToken, async (req, res) => {
    const { usuario_id, sala_id, fecha, asientos, nombre_tarjeta, numero_tarjeta, cvv, fecha_expiracion } = req.body;

    if (req.user.id !== usuario_id) {
        return res.status(403).json({ mensaje: 'No autorizado para crear reservas para otro usuario.' });
    }

    if (!usuario_id || !sala_id || !fecha || !asientos || asientos.length === 0 || !nombre_tarjeta || !numero_tarjeta || !cvv || !fecha_expiracion) {
        return res.status(400).json({ mensaje: 'Todos los campos son obligatorios para la reserva.' });
    }

    try {
        const nuevaReserva = await Reservacion.create({
            usuario_id,
            sala_id,
            fecha,
            asientos, 
            nombre_tarjeta,
            numero_tarjeta,
            cvv,
            fecha_expiracion
        });

        res.status(201).json({ mensaje: 'Reserva creada exitosamente.', id: nuevaReserva.id });

    } catch (err) {
        console.error('Error al insertar reserva con Sequelize:', err.message);
        return res.status(500).json({ mensaje: 'Error interno del servidor al registrar la reserva.', error: err.message });
    }
});

module.exports = router;
