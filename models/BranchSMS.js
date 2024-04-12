const sequelize = require("../database/connections");
const { INTEGER } = require("sequelize");

const BranchSMS = sequelize.define("sms_branches", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  branchId: {
    type: INTEGER,
    allowNull: false,
  },
  smsMessageId: {
    type: INTEGER,
    allowNull: false,
  },
});
module.exports = BranchSMS;
