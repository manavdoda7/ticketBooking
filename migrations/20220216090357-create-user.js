'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        allowNull:false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull:false
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull:false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      mobile: {
        type: Sequelize.STRING,
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.createTable('provider', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        allowNull:false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull:false
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull:false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      org: {
        type: Sequelize.STRING,
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.createTable('shows', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      provider: {
        type: Sequelize.STRING,
        references: { model: 'provider', key: 'email' }
      },
      name: {
        type: Sequelize.STRING,
        allowNull:false
      },
      info: {
        type: Sequelize.STRING(1234),
        allowNull:false
      },
      begTime: {
        type: Sequelize.DATE,
        allowNull: false
      },
      duration: {
        type: 'INTERVAL',
        allowNull:false
      },
      rated: {
        type: Sequelize.STRING,
        allowNull:false
      },
      ratings: {
        type: Sequelize.REAL,
        allowNull:false
      },
      seats: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    
    await queryInterface.createTable('bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      showID: {
        type: Sequelize.INTEGER,
        allowNull:false,
        unique: true,
        references: {model:'shows', key:'id'}
      },
      clientID: {
        type: Sequelize.STRING,
        allowNull:false,
        references: {model:'users', key:'email'}
      },
      seat: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropAllTables();
  }
};