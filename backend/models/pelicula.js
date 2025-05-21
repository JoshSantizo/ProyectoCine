// backend/models/pelicula.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Importa la instancia de Sequelize

const Pelicula = sequelize.define('Pelicula', {
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
    sinopsis: {
        type: DataTypes.TEXT, // Usamos TEXT para sinopsis que puede ser larga
        allowNull: false
    },
    duracion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    imagen: {
        type: DataTypes.STRING, // VARCHAR para la URL de la imagen
        allowNull: false
    },
}, {
    tableName: 'pelicula', // Mapea al nombre de tabla 'pelicula' (singular)
    timestamps: false     // Desactiva createdAt/updatedAt si tu tabla no los tiene
});

module.exports = Pelicula; // Exporta el modelo Pelicula