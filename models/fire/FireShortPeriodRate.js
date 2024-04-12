const { STRING, DOUBLE, DATE, BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../../database/connections");

const FireShortPeriodRate = sequelize.define("fire_short_period_rates", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    minDuration: {
        type: INTEGER,
        allowNull: false,
    },
    maxDuration: {
        type: INTEGER,
        allowNull: false,
    },
    isCancellation: {
        type: BOOLEAN,
        allowNull: false,
    },
    rate: {
        type: DOUBLE,
        allowNull: false,
    },
    userId: {
        type: INTEGER,
    },
    branchId: {
        type: INTEGER,
    }
});

module.exports = FireShortPeriodRate