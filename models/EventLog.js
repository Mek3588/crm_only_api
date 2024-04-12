const { STRING, DataTypes } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const User = require("./acl/user");
const BranchPhones = require("./BranchPhone");
const Employee = require("./Employee");
const PhoneNo = require("./PhoneNo");

const EventLog = sequelize.define("event_logs", {
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: INTEGER,
    allowNull: false,
  },
  resourceType: {
    type: STRING,
    allowNull: false,
  },
  resourceName: {
    type: STRING,
    allowNull: false,
  },
  resourceId: {
    type: INTEGER,
    allowNull: false,
  },
  action: {
    type: STRING,
    allowNull: false,
  },
  changedField: {
    type: STRING,
  },
  ipAddress: {
    type: STRING,
  },
});

EventLog.belongsTo(User, { foreignKey: "userId", as: "user" });

module.exports = EventLog;
