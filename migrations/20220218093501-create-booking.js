'use strict';

const show = require("../models/show");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('booking', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      show_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references:{ model:"show", key:"id" },
        onDelete: 'CASCADE',
      },
      client_id: {
        allowNull: false,
        type: Sequelize.STRING,
        references:{ model:"client", key:"email" },
        onDelete: 'CASCADE',
      },
      hallBooking_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references:{ model:"hallBooking", key:"id" },
        onDelete: 'CASCADE',
      },
      seat: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      begTime: {
        allowNull: false,
        type: 'timestamp',
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
      tableName:'booking'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('booking');
  }
};