const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuario'); 

router.post('/login', usuarioController.loginUsuario); 
router.post('/register', usuarioController.registerUsuario); 

module.exports = router;