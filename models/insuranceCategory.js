const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const RiskType = require("./RiskType");

const InsuranceCategory = sequelize.define("insurance_categories", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: STRING,
        allowNull: false,
    }, 
    description: {
        type: STRING,
        allowNull: false,
    },
}) 
//  InsuranceCategory.hasMany(RiskType)

module.exports = InsuranceCategory