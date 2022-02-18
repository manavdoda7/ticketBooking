'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('hallsCapacity', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      hallNumber: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      provider_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {model:'provider', key:'email'},
        onDelete: 'CASCADE'
      },
      seats: {
        type: Sequelize.INTEGER,
        allowNull: false
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
      tableName:'hallsCapacity'
    }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('hallsCapacities');
  }
};