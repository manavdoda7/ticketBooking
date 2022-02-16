const { Sequelize, DataTypes } = require("sequelize");
const db = require("../middlewares/dbconnection");

const Booking = db.define(
    "booking",
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          showID: {
            type: Sequelize.INTEGER,
            allowNull:false,
            references: {model:'show', key:'id'}
          },
          clientID: {
            type: Sequelize.STRING,
            allowNull:false,
            references: {model:'client', key:'email'}
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
    },
    {
        tableName:"booking"
    }
)

Booking.sync()
.then(()=>{
    console.log("Booking Table created")
}).catch((err) => {
    console.log('Error in creating bookings table.', err);
})

module.exports = Booking