const { STRING,INTEGER } = require("sequelize");
const sequelize = require("../database/connections");

const Address = sequelize.define("addresses", {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,

    },
    country: {
        type: STRING,
        allowNull: false
    },
    city: {
        type: STRING,
        allowNull: false
    },
    subCity: {
        type: STRING,
        allowNull: false
    },
     woreda: {
        type: STRING,
        allowNull: false
    },
    houseNumber: {
        type: STRING,
        allowNull: false
    },
    


   
})

module.exports = Address