const { STRING, NUMBER } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const InsuranceCategory = require("./insuranceCategory");

const RiskType = sequelize.define("risk_types", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    code: {
        type: INTEGER,
        allowNull: false,
    },
    type: { 
        type: STRING,
        allowNull: false,
    },
    rate: {
        type: INTEGER, 
        allowNull: false,
    },
    insuranceCategoryId: {
    type: INTEGER,
  },
})
InsuranceCategory.hasMany(RiskType)
RiskType.belongsTo(InsuranceCategory); 
module.exports = RiskType