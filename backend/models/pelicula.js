const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

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
        type: DataTypes.TEXT,
        allowNull: false
    },
    duracion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    imagen: {
        type: DataTypes.STRING, 
        allowNull: false
    },
}, {
    tableName: 'pelicula', 
    timestamps: false    
});

module.exports = Pelicula;