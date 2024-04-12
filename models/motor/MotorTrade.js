const { STRING, DOUBLE } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../../database/connections");

const MotorTrade = sequelize.define("motor_trades", {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    is_garage: {
        type: BOOLEAN,
        allowNull: false,
    },
    risk_type: {
        type: STRING
    },
    rate: {
        type: DOUBLE
    },
});

module.exports = MotorTrade;