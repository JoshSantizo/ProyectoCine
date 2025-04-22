// server.js
const express = require('express');
const cors = require('cors');
const usuarioRoutes = require('./routes/usuario');
const salaRoutes = require('./routes/sala');
const reservacionRoutes = require('./routes/reservacion');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/usuario', usuarioRoutes);
app.use('/sala', salaRoutes);
app.use('/reservacion', reservacionRoutes);

app.listen(port, () => {
    console.log(`Servidor backend escuchando en el puerto ${port}`);
});
