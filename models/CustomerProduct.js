const { STRING } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER, TEXT } = require("sequelize");
const sequelize = require("../database/connections");
const BranchPhones = require("./BranchPhone");
const CustomerProductCategory = require("./CustomerProductCategory");
const Employee = require("./Employee");
const PhoneNo = require("./PhoneNo");

const CustomerProduct = sequelize.define("customer_products", {
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  customerProductCategoryId: {
    type: INTEGER
  },
  name: {
    type: STRING,
    allowNull: false,
  },
  description: {
    type: TEXT('long'),
  },
  productImage: {
    type: STRING,
  },
  isActive: {
    type: BOOLEAN
  },
});

CustomerProduct.belongsTo(CustomerProductCategory);
module.exports = CustomerProduct;
