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
      HallBookings.belongsTo(models.show, {foreignKey:'show_id', targetKey:'id', constraints:false})
      HallBookings.belongsTo(models.provider, {foreignKey:'provider_id', targetKey:'email',constraints:false})
      models.show.hasMany(HallBookings, {foreignKey:'show_id', targetKey:'id',constraints:false})
      models.provider.hasMany(HallBookings, {foreignKey:'provider_id', targetKey:'email',constraints:false})
    }
  }
  HallBookings.init({
    begTime: DataTypes.DATE,
    hallNumber: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'hallBooking',
    tableName: 'hallBooking',
  });
  return HallBookings;
};