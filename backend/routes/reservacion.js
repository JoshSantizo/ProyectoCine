const express = require('express');
const router = express.Router();
const reservacionController = require('../controllers/reservacion'); 

router.post('/', reservacionController.crearReservacion);
router.get('/', reservacionController.obtenerReservaciones);
router.get('/:id', reservacionController.obtenerReservacionPorId);
router.put('/:id', reservacionController.actualizarReservacion);
router.delete('/:id', reservacionController.eliminarReservacion);

module.exports = router;