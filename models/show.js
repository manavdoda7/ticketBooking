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
      console.log(models)
      Show.belongsTo(models.provider, {foreignKey: 'provider_id', targetKey: 'email'})
      models.provider.hasMany(Show, {foreignKey: 'provider_id', targetKey: 'email'})
    }
  }
  Show.init({
    name: DataTypes.STRING,
    info: DataTypes.STRING,
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