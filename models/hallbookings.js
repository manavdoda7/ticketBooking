'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HallBookings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  HallBookings.init({
    showID: DataTypes.INTEGER,
    begTime: DataTypes.DATE,
    hallNumber: DataTypes.INTEGER,
    provider: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'hallBooking',
    tableName: 'hallBooking',
  });
  return HallBookings;
};