'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('show', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      info: {
        allowNull: false,
        type: Sequelize.STRING
      },
      provider_id: {
        allowNull: false,
        type: Sequelize.STRING,
        references: { model: "provider", key: "email" },
        onDelete: 'CASCADE',
      },
      duration: {
        allowNull: false,
        type: 'interval'
      },
      rated: {
        allowNull: false,
        type: Sequelize.STRING
      },
      ratings: {
        allowNull: false,
        type: Sequelize.DOUBLE
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
      tableName:'show'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('show');
  }
};