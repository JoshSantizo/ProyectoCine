// backend/routes/pelicula.js
const express = require('express');
const router = express.Router();
const peliculaController = require('../controllers/pelicula');
// ¡CAMBIO AQUÍ! Importa los nombres de middleware correctos
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware'); 

// Rutas de películas (GET pueden ser públicas o solo necesitar verificarToken si quieres que solo logueados las vean)
router.get('/', peliculaController.getAllPeliculas); 
router.get('/:id', peliculaController.getPeliculaById); 

// Rutas de administración para películas (protegidas por token Y por rol de administrador)
// ¡CAMBIO AQUÍ! Usa los nombres de middleware correctos
router.post('/', authenticateToken, authorizeRoles(['administrador']), peliculaController.createPelicula);
router.put('/:id', authenticateToken, authorizeRoles(['administrador']), peliculaController.updatePelicula);
router.delete('/:id', authenticateToken, authorizeRoles(['administrador']), peliculaController.deletePelicula);

module.exports = router;
