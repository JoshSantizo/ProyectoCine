// backend/models/usuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Importa la instancia de Sequelize

const Usuario = sequelize.define('Usuario', {
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
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // Asegura que los nombres de usuario sean únicos
    },
    contrasena: { // Almacenará el hash de la contraseña
        type: DataTypes.STRING, 
        allowNull: false
    },
    tipo: { // Para el ENUM('cliente', 'administrador')
        type: DataTypes.ENUM('cliente', 'administrador'),
        defaultValue: 'cliente',
        allowNull: false
    },
}, {
    tableName: 'usuario', // Mapea al nombre de tabla 'usuario' (singular)
    timestamps: false     // Desactiva createdAt/updatedAt si tu tabla no los tiene
});

module.exports = Usuario; // Exporta el modelo Usuario