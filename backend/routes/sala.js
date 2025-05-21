const express = require('express');
const router = express.Router();
const salaController = require('../controllers/sala'); // Importa el controlador de salas
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware'); // Importa los middlewares renombrados


router.get('/', authenticateToken, salaController.getAllSalas); 
router.get('/:id', authenticateToken, salaController.getSalaById); 
router.post('/', authenticateToken, authorizeRoles(['administrador']), salaController.createSala);
router.put('/:id', authenticateToken, authorizeRoles(['administrador']), salaController.updateSala);
router.delete('/:id', authenticateToken, authorizeRoles(['administrador']), salaController.deleteSala);

module.exports = router;
