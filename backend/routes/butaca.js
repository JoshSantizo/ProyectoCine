// backend/routes/butaca.js
const express = require('express');
const router = express.Router();
const butacaController = require('../controllers/butaca'); // Ruta correcta al controlador
const { verificarToken } = require('../middleware/authMiddleware');

router.get('/:salaId/:fecha', verificarToken, butacaController.getButacasEstado);

module.exports = router;