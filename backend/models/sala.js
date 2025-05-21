// backend/models/sala.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Importa la instancia de Sequelize
const Pelicula = require('./pelicula');   // Importa el modelo Pelicula para la relación

const Sala = sequelize.define('Sala', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    filas: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    columnas: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    pelicula_id: { // Columna para la clave foránea
        type: DataTypes.INTEGER,
        allowNull: true, // Puede ser null si una sala no tiene película asignada
        references: {
            model: 'pelicula', // ¡Importante! Nombre de la TABLA de la película
            key: 'id',
        }
    }
}, {
    tableName: 'sala', // Mapea al nombre de tabla 'sala' (singular)
    timestamps: false // Desactiva createdAt/updatedAt si tu tabla no los tiene
});

// Define la relación: Una Sala pertenece a una Pelicula (muchas salas pueden tener la misma película asignada)
// Esto permite usar `Sala.findAll({ include: 'pelicula' })`
Sala.belongsTo(Pelicula, { foreignKey: 'pelicula_id', as: 'pelicula' });

// Opcional: Define la relación inversa (una Pelicula tiene muchas Salas)
// Esto es para que puedas hacer Pelicula.hasMany(Sala) si lo necesitas en el futuro
// Pelicula.hasMany(Sala, { foreignKey: 'pelicula_id', as: 'salas' });

module.exports = Sala; // Exporta el modelo Sala