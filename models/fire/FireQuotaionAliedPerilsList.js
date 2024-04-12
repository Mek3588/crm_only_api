const { STRING, BOOLEAN } = require("sequelize");
const { DOUBLE } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../../database/connections");

const FireQuotationAlliedPerils = sequelize.define("fire_quotations_alied_perils", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    fireQuotationId: {
        type: INTEGER,
        allowNull: false,
    },
    fireAlliedPerilsRateId:{
        type:INTEGER,
        allowNull: false
    },
})

module.exports = FireQuotationAlliedPerils