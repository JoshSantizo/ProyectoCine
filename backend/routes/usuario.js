// backend/routes/usuario.js
const express = require('express');
const router = express.Router();
// Asegúrate de que esta ruta de importación sea 100% correcta
const usuarioController = require('../controllers/usuario'); 

// Asegúrate de que 'usuarioController' tenga las funciones 'loginUsuario' y 'registerUsuario'
// y que no haya errores de tipeo.
router.post('/login', usuarioController.loginUsuario); 
router.post('/register', usuarioController.registerUsuario); 

module.exports = router;