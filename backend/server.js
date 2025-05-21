// backend/server.js (FRAGMENTO)
const express = require('express');
const cors = require('cors'); // Asegúrate de tener cors si tu frontend y backend están en diferentes puertos/dominios
const dotenv = require('dotenv'); // Para cargar variables de entorno
dotenv.config();

// Importar la configuración de la base de datos (para asegurar la conexión)
require('./config/db'); // Esto ejecuta la conexión a la DB al iniciar el servidor

// Importar los modelos (para que Sequelize los registre)
require('./models/usuario');
require('./models/pelicula');
require('./models/sala'); // Asegúrate de que Sala y Pelicula estén importados para las relaciones

// Importar las rutas
const authRoutes = require('./routes/auth');
const peliculaRoutes = require('./routes/pelicula');
const salaRoutes = require('./routes/sala'); // <--- ¡VERIFICAR QUE APUNTE A 'sala' sin .js!

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(express.json()); // Para parsear el cuerpo de las peticiones en formato JSON
app.use(cors()); // Habilita CORS para todas las rutas. Considera configuraciones más específicas en producción.

// Usar las rutas
app.use('/auth', authRoutes);
app.use('/peliculas', peliculaRoutes);
app.use('/salas', salaRoutes); // <--- Usar las rutas bajo el prefijo /salas

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API del Cine funcionando!');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});