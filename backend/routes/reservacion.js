const express = require('express');
const router = express.Router();
const reservacionController = require('../controllers/reservacion');

router.post('/', reservacionController.crearReservacion);
router.get('/:id', reservacionController.obtenerReservacionPorId);
router.patch('/:id/estado', reservacionController.actualizarEstadoReservacion);

module.exports = router;