'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class hallsCapacity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      hallsCapacity.belongsTo(models.provider, {foreignKey:'provider_id', targetKey:'email'})
      models.provider.hasMany(hallsCapacity, {foreignKey:'provider_id', targetKey:'email'})
    }
  }
  hallsCapacity.init({
    hallNumber: DataTypes.INTEGER,
    seats: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'hallsCapacity',
    tableName:'hallsCapacity'
  });
  return hallsCapacity;
};