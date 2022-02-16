const { Sequelize, DataTypes } = require("sequelize");
const db = require("../middlewares/dbconnection");

const Show = db.define(
  "show",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    provider: {
      type: Sequelize.STRING,
      allowNull:true,
      references: { model: "provider", key: "email" },
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    info: {
      type: Sequelize.STRING(1234),
      allowNull: false,
    },
    begTime: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    duration: {
      type: "INTERVAL",
      allowNull: false,
    },
    rated: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    ratings: {
      type: Sequelize.REAL,
      allowNull: false,
    },
    seats: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  },
  {
    tableName: "show",
  }
);

Show.sync().then(() => {
  console.log("Show Table created");
}).catch((err) => {
    console.log('Error in creating show table.', err);
})

module.exports = Show;
