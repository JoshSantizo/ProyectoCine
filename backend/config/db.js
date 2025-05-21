// backend/config/db.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config(); // Carga las variables de entorno desde .env

const sequelize = new Sequelize(
    process.env.DB_NAME,     // Nombre de tu base de datos (ej. 'cine')
    process.env.DB_USER,     // Nombre de usuario de la base de datos (ej. 'root')
    process.env.DB_PASSWORD, // Contraseña de la base de datos (vacía si no tienes)
    {
        host: process.env.DB_HOST, // Host de la base de datos (ej. 'localhost')
        dialect: 'mysql',          // Dialecto de la base de datos
        logging: false,            // Desactiva el logging de SQL en consola (pon true para depurar consultas SQL)
        define: {
            freezeTableName: true  // Evita que Sequelize pluralice automáticamente los nombres de las tablas
        },
        pool: { // Configuración del pool de conexiones
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// Autenticar la conexión
async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');
        
        // Sincroniza todos los modelos definidos con la base de datos.
        // Solo descomenta si quieres que Sequelize cree/actualice tus tablas.
        // ¡ADVERTENCIA!: 'force: true' borrará y recreará las tablas existentes.
        // NO LO USES EN PRODUCCIÓN A MENOS QUE SEPAS EXACTAMENTE LO QUE HACES.
        // await sequelize.sync({ force: false }); 
        // console.log('Todos los modelos han sido sincronizados.');

    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
        process.exit(1); // Salir del proceso si la conexión falla
    }
}

connectDB(); // Llama a la función para conectar al iniciar el servidor

module.exports = sequelize; // Exporta la instancia de Sequelize