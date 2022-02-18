'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Show extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Show.init({
    name: DataTypes.STRING,
    info: DataTypes.STRING,
    provider: DataTypes.STRING,
    duration: 'interval',
    rated: DataTypes.STRING,
    ratings: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'show',
    tableName: 'show'
  });
  return Show;
};