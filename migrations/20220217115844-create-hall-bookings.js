'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('hallBooking', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      showID: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {model:'show', key:'id'}
      },
      begTime: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      hallNumber: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      provider: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {model:'provider', key:'email'}
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    },
    {
      tableName:'hallBooking',
    }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('hallBooking');
  }
};