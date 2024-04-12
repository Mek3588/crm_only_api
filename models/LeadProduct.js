const { STRING } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const BranchPhones = require("./BranchPhone");
const Employee = require("./Employee");
const PhoneNo = require("./PhoneNo");

const LeadProduct = sequelize.define("lead_products", {
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  contactId: {
    type: INTEGER,
    allowNull: false,
  },
  productId: {
    type: INTEGER,
    allowNull: false,
  },
});
// sequelize.sync({ alter: true });

module.exports = LeadProduct;
