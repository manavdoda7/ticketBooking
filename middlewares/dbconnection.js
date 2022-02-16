const { Sequelize, Model, DataTypes } = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres'
  });

module.exports=sequelize