'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.client, {foreignKey:'client_id', targetKey:'email'})
      Booking.belongsTo(models.show, {foreignKey:'show_id', targetKey:'id'})
      Booking.belongsTo(models.hallBooking, {foreignKey:'hallBooking_id', targetKey:'id'})
      models.client.hasMany(Booking, {foreignKey:'client_id', targetKey:'email'})
      models.show.hasMany(Booking, {foreignKey:'show_id', targetKey:'id'})
      models.hallBooking.hasMany(Booking, {foreignKey:'hallBooking_id', targetKey:'id'})
    }
  }
  Booking.init({
    seat: DataTypes.INTEGER,
    begTime: 'timestamp'
  }, {
    sequelize,
    modelName: 'booking',
    tableName:'booking'
  });
  return Booking;
};