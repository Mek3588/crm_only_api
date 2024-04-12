const sequelize = require("../../database/connections");
const { INTEGER } = require("sequelize");

const CustomerSms = sequelize.define("sms_customers", {
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
  smsMessageId: {
    type: INTEGER,
    allowNull: false,
  },
});
module.exports = CustomerSms;
