const { STRING, BOOLEAN } = require("sequelize");
const { DOUBLE } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../../database/connections");

const FireChargeRate = sequelize.define("fire_charge_rate", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    chargeReson: {
        type: STRING,
        allowNull: false,
    },
    rate:{
        type:DOUBLE,
        allowNull: false
    },
    isLoading:{
        type: BOOLEAN,
        allowNull: false
    },
})

module.exports = FireChargeRate