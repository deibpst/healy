// models/user.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  usuario_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'usuario_id'
  },
  nombre: {
    type: DataTypes.STRING(60),
    allowNull: false,
    field: 'nombre'
  },
  apellidos: {
    type: DataTypes.STRING(60),
    allowNull: false,
    field: 'apellidos'
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    field: 'email'
  },
  telefono: {
    type: DataTypes.STRING(15),
    allowNull: true,
    field: 'telefono'
  },
  rol: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'rol'
  },
  contrasena: {
    type: DataTypes.STRING(200),
    allowNull: false,
    field: 'contrasena'
  },
  fecha_registro: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'fecha_registro'
  },
  google_refresh_token: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'google_refresh_token'
  }
}, {
  tableName: 'usuario',
  timestamps: false,
  freezeTableName: true
});

module.exports = User;