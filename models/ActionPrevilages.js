const { STRING, DOUBLE } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const BranchPhones = require("./BranchPhone");
const Employee = require("./Employee");
const PhoneNo = require("./PhoneNo");

const ActionPrevilage = sequelize.define("actionPrevilages", {
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  object: {
    type: STRING,
    allowNull: false,
  },
  group: {
    allowNull: false,
    type: INTEGER,
  },
  action: {
    type: STRING,
  },
});

module.exports = ActionPrevilage;
