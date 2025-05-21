const express = require('express');
const router = express.Router();
const peliculaController = require('../controllers/pelicula');

const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware'); 


router.get('/', peliculaController.getAllPeliculas); 
router.get('/:id', peliculaController.getPeliculaById); 

router.post('/', authenticateToken, authorizeRoles(['administrador']), peliculaController.createPelicula);
router.put('/:id', authenticateToken, authorizeRoles(['administrador']), peliculaController.updatePelicula);
router.delete('/:id', authenticateToken, authorizeRoles(['administrador']), peliculaController.deletePelicula);

module.exports = router;
