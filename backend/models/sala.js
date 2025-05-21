const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 
const Pelicula = require('./pelicula');   

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
    pelicula_id: { 
        type: DataTypes.INTEGER,
        allowNull: true, 
        references: {
            model: 'pelicula', 
            key: 'id',
        }
    }
}, {
    tableName: 'sala', 
    timestamps: false 
});

Sala.belongsTo(Pelicula, { foreignKey: 'pelicula_id', as: 'pelicula' });

module.exports = Sala; 