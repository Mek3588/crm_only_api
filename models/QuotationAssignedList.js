const { INTEGER } = require("sequelize");

const sequelize = require("../database/connections");

const QuotationAssigned = sequelize.define("quotation_assigned_employees", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    },
 employeeId: {
    type: INTEGER,
    allowNull: false,
    },
 quotationAssignedId: {
    type: INTEGER,
    allowNull: false,
  },
});

    
module.exports = QuotationAssigned
