const { STRING, DOUBLE, DATE, BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../../database/connections");

const FireSumInsuredDiscount = sequelize.define("fire_sum_insured_discounts", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    minimum_amount: {
        type: STRING,
        allowNull: false,
    },
    maximum_amount: {
        type: STRING,
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

module.exports = FireSumInsuredDiscount