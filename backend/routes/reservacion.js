// backend/routes/reservacion.js
const express = require('express');
const router = express.Router();
const reservacionController = require('../controllers/reservacion'); // Ruta correcta al controlador
const { verificarToken } = require('../middleware/authMiddleware');

router.post('/', verificarToken, reservacionController.createReservacion);

module.exports = router;