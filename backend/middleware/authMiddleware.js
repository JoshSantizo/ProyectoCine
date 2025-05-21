const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET; 

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
        req.user = user; 
        next(); 
    });
}

function authorizeRoles(roles) { 
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.tipo)) {
            return res.status(403).json({ mensaje: 'Acceso denegado. No tienes los permisos necesarios.' });
        }
        next();
    };
}

module.exports = { authenticateToken, authorizeRoles }; 
