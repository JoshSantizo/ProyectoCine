const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ mensaje: 'Acceso denegado. Token no proporcionado' });
    }

    try {
        const verified = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.usuario = verified;
        next();
    } catch (error) {
        res.status(400).json({ mensaje: 'Token inválido' });
    }
}

module.exports = auth;