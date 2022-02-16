const { Sequelize, Model, DataTypes } = require("sequelize");
const db = require("../middlewares/dbconnection");

const Client = db.define(
  "client",
  {
    // Model attributes are defined here
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
    mobile: {
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
    tableName: "client",
  }
);

Client.sync().then(() => {
  console.log("client table created");
}).catch((err)=>{
  console.log('Error in creating client table.', err);
})
// console.log(User === db.model.User);
// async function a() {
//   try{
//     let jane = await User.create({ email:'manavdoda7@gmail.com', password:'1234', firstName: "Jane", lastName: "Doe", mobile:'123456', org:'NITH' });
//     console.log("Jane's auto-generated ID:", jane.id);
//   } catch(err) {
//     console.log('Error:', err);
//   }
// }
// a()
module.exports = Client;
