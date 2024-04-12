const sequelize = require("../../database/connections");
const {INTEGER} = require("sequelize");

const CustomerEmails = sequelize.define("customer_emails", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  customerId: {
    type: INTEGER,
    allowNull: false,
  },
  emailModelId: {
    type: INTEGER,
    allowNull: false,
  },
});
module.exports = CustomerEmails;