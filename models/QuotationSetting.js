const { STRING } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");

const QuotationSetting = sequelize.define("quotation_settings", {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    product: {
        type: STRING
    },
    quotationCalculation: {
        type: STRING,
        default: "Flat"
    },
});

module.exports = QuotationSetting;