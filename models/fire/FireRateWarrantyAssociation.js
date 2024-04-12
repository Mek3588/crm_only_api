const { STRING, BOOLEAN } = require("sequelize");
const { DOUBLE } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../../database/connections");

const FireRateWarrantyAssociation = sequelize.define("fire_rate_Warranty_associations", {
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
    fireWarrantyId:{
        type:INTEGER,
        allowNull: false
    },
})

module.exports = FireRateWarrantyAssociation