const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario');

router.post('/registro', usuarioController.registro);
router.post('/login', usuarioController.login);

module.exports = router;