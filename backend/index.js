const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { registrarUsuario, verificarCredenciales, obtenerUsuario } = require('./consultas');
const { validarToken, registrarConsulta } = require('./middleware');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Registrar una consulta (Middleware global)
app.use(registrarConsulta);

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.post('/usuarios', async (req, res) => {
    try {
        const usuario = req.body;
        await registrarUsuario(usuario);
        res.status(201).send('Usuario registrado con éxito.');
    } catch (error) {
        res.status(400).json('Faltan campos requeridos');
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await verificarCredenciales(email, password);
        res.json({ token });
    } catch (error) {
        res.status(401).json({ message: 'Credenciales inválidas', error });
    }
});

app.get('/usuarios', validarToken, async (req, res) => {
    try {
        const { email } = req.user;
        const usuario = await obtenerUsuario(email);
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario', error });
    }
});

// Ruta para manejar errores 404
app.use((req, res) => {
    res.status(404).send('Ruta no encontrada.');
});


