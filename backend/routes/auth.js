// backend/routes/auth.js
const express = require('express');
const router = express.Router();
// ¡Asegúrate de que esta ruta sea correcta y apunte a tu archivo controllers/auth.js!
const authController = require('../controllers/auth'); 

// Ruta para el registro de nuevos usuarios
// Método: POST
// Endpoint: /api/auth/register
router.post('/register', authController.register);

// Ruta para el inicio de sesión de usuarios existentes
// Método: POST
// Endpoint: /api/auth/login
router.post('/login', authController.login);

module.exports = router;