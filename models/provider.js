const { Sequelize, DataTypes } = require("sequelize");
const db = require("../middlewares/dbconnection");

const Provider = db.define(
  "provider",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    org: {
      type: Sequelize.STRING,
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
    tableName: "provider",
  }
);

Provider.sync().then(() => {
  console.log("provider table created");
}).catch((err) => {
  console.log('Error in creating provider table.', err);
})
// sequelize.define` also returns the model
// console.log(Provider === db.models.Provider);
// async function a() {
//   try{
//     let jane = await Provider.create({ email:'manavdoda7@gmail.com', password:'1234', firstName: "Jane", lastName: "Doe", org:'NITH' });
//     console.log("Jane's auto-generated ID:", jane.id);
//   } catch(err) {
//     console.log('Error:', err);
//   }
// }
// a()
module.exports = Provider;
