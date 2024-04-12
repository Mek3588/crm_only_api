const { STRING, BOOLEAN } = require("sequelize");
const { DOUBLE } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../../database/connections");

const FireWarrantyApplicableRelations = sequelize.define("fire_warranty_applicable_relations", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    fireApplicableWarrantyId: {
        type: INTEGER,
        allowNull: false,
    },
    fireWarrantyId:{ 
        type:INTEGER,
        allowNull: false
    },
})

module.exports = FireWarrantyApplicableRelations