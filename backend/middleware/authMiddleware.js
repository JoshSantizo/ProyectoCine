// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET; 

// Renombramos verificarToken a authenticateToken
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ mensaje: 'Acceso denegado. No se proporcionó token de autenticación.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Error de verificación de token:', err.message);
            return res.status(403).json({ mensaje: 'Token de autenticación inválido o expirado.' });
        }
        // El 'user' aquí es el payload del token (ej. { id: 1, username: "testuser", tipo: "administrador" })
        req.user = user; 
        next(); 
    });
}

// Renombramos verificarRolAdmin a authorizeRoles
function authorizeRoles(roles) { // Acepta un array de roles esperados
    return (req, res, next) => {
        // Asegúrate de que req.user existe y que su tipo está incluido en los roles permitidos
        if (!req.user || !roles.includes(req.user.tipo)) {
            return res.status(403).json({ mensaje: 'Acceso denegado. No tienes los permisos necesarios.' });
        }
        next();
    };
}

module.exports = { authenticateToken, authorizeRoles }; // Exporta con los nuevos nombres
