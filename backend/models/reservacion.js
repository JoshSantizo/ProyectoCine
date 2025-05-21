const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const Reservacion = sequelize.define('Reservacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Usuario', 
            key: 'id'
        }
    },
    sala_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Sala', 
            key: 'id'
        }
    },
    fecha: {
        type: DataTypes.DATEONLY, 
        allowNull: false
    },
    asientos: {
        type: DataTypes.JSON,
        allowNull: false
    },
    nombre_tarjeta: {
        type: DataTypes.STRING,
        allowNull: false
    },
    numero_tarjeta: {
        type: DataTypes.STRING(16), 
        allowNull: false
    },
    cvv: {
        type: DataTypes.STRING(4), 
        allowNull: false
    },
    fecha_expiracion: {
        type: DataTypes.STRING(5),
        allowNull: false
    }
}, {
    tableName: 'reservacion', 
    timestamps: false 
});

const Usuario = require('./usuario'); 
const Sala = require('./sala'); 

Reservacion.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Reservacion.belongsTo(Sala, { foreignKey: 'sala_id' });

module.exports = Reservacion;