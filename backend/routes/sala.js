// backend/routes/sala.js
const express = require('express');
const router = express.Router();
const salaController = require('../controllers/sala'); // Importa el controlador de salas
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware'); // Importa los middlewares renombrados

// Rutas protegidas para la administración de salas (solo administradores)
// GET: Obtener todas las salas
router.get('/', authenticateToken, salaController.getAllSalas); 

// GET: Obtener una sala por ID
router.get('/:id', authenticateToken, salaController.getSalaById); 

// POST: Crear una nueva sala (Solo administradores)
router.post('/', authenticateToken, authorizeRoles(['administrador']), salaController.createSala);

// PUT: Actualizar una sala existente (Solo administradores)
router.put('/:id', authenticateToken, authorizeRoles(['administrador']), salaController.updateSala);

// DELETE: Eliminar una sala (Solo administradores)
router.delete('/:id', authenticateToken, authorizeRoles(['administrador']), salaController.deleteSala);

module.exports = router;
