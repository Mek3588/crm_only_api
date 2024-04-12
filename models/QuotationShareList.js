const { INTEGER } = require("sequelize");

const sequelize = require("../database/connections");

const QuotationShare = sequelize.define("quotation_share_employees", {
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
 quotationShareId: {
    type: INTEGER,
    allowNull: false,
  },
});

    
module.exports = QuotationShare
