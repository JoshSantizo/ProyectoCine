const express = require('express');
const router = express.Router();
const butacaController = require('../controllers/butaca'); 
const { verificarToken } = require('../middleware/authMiddleware');

router.get('/:salaId/:fecha', verificarToken, butacaController.getButacasEstado);

module.exports = router;