const { STRING, BOOLEAN } = require("sequelize");
const { DOUBLE } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../../database/connections");

const FireRateApplicableWarrantys = sequelize.define("fire_rate_applicable_warrantys", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    fireRateId: {
        type: INTEGER,
        allowNull: false,
    },
    fireApplicableWarrantyId:{ 
        type:INTEGER,
        allowNull: false
    },
})

module.exports = FireRateApplicableWarrantys