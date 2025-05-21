const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

require('./config/db'); 
require('./models/usuario');
require('./models/pelicula');
require('./models/sala');
require('./models/reservacion'); 

// Importar las rutas
const authRoutes = require('./routes/auth');
const peliculaRoutes = require('./routes/pelicula');
const salaRoutes = require('./routes/sala');
const reservacionRoutes = require('./routes/reservacion'); 

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(express.json()); 
app.use(cors()); 

// Usar las rutas
app.use('/auth', authRoutes);
app.use('/peliculas', peliculaRoutes);
app.use('/salas', salaRoutes);
app.use('/reservaciones', reservacionRoutes); 

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API del Cine funcionando!');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});