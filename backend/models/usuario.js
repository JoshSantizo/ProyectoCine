const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

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
        unique: true 
    },
    contrasena: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    tipo: { 
        type: DataTypes.ENUM('cliente', 'administrador'),
        defaultValue: 'cliente',
        allowNull: false
    },
}, {
    tableName: 'usuario', 
    timestamps: false   
});

module.exports = Usuario; 