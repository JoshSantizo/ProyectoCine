const express = require('express');
const router = express.Router();
const salaController = require('../controllers/sala');

router.post('/', salaController.crearSala);
router.get('/', salaController.obtenerSalas);
router.get('/:id', salaController.obtenerSalaPorId);
router.put('/:id', salaController.actualizarSala);
router.delete('/:id', salaController.eliminarSala);

module.exports = router;
