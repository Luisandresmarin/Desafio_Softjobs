const jwt = require('jsonwebtoken');

// Middleware para validar tokens 
const validarToken = (req, res, next) => {
    const Authorization = req.header('Authorization');
    if (!Authorization) {
        return res.status(403).send('Token no proporcionado');
    }

    const token = Authorization.split('Bearer ')[1];
    try {
        const payload = jwt.verify(token, "az_AZ");
        req.user = payload;
        next();
    } catch (error) {
        res.status(403).send('Token inválido o expirado');
    }
};

// Middleware para registrar las consultas en la terminal
const registrarConsulta = (req, res, next) => {
    console.log(`Ruta consultada: ${req.path} - Método: ${req.method}`);
    next();
};

module.exports = { validarToken, registrarConsulta };
