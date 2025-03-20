const express = require('express');
const router = express.Router();
const butacaController = require('../controllers/butaca');

router.post('/', butacaController.crearButaca);
router.get('/', butacaController.obtenerButacas);
router.get('/:id', butacaController.obtenerButacaPorId);
router.put('/:id', butacaController.actualizarButaca);
router.delete('/:id', butacaController.eliminarButaca);

module.exports = router;