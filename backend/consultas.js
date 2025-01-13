const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: 'lucho0402',
    database: 'softjobs',
    port: 5432,
    allowExitOnIdle: true,
});

// Registrar un usuario en la base de datos
const registrarUsuario = async ({ email, password, rol, lenguage }) => {
    const passwordEncriptada = bcrypt.hashSync(password, 10);
    const query = 'INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4)';
    const values = [email, passwordEncriptada, rol, lenguage];
    await pool.query(query, values);
};

// Para verificar credenciales y generar un token 
const verificarCredenciales = async (email, password) => {
    const query = 'SELECT * FROM usuarios WHERE email = $1';
    const { rows: [usuario] } = await pool.query(query, [email]);

    if (!usuario || !bcrypt.compareSync(password, usuario.password)) {
        throw new Error('Credenciales inválidas');
    }

    const token = jwt.sign({ email: usuario.email }, "az_AZ", { expiresIn: '1h' });
    return token;
};

// Obtener información del usuario autenticado
const obtenerUsuario = async (email) => {
    const query = 'SELECT id, email, rol, lenguage FROM usuarios WHERE email = $1';
    const { rows: [usuario] } = await pool.query(query, [email]);
    return usuario;
};

module.exports = { registrarUsuario, verificarCredenciales, obtenerUsuario };
