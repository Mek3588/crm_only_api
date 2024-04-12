const { STRING } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const BranchPhones = require("./BranchPhone");
const Employee = require("./Employee");
const PhoneNo = require("./PhoneNo");

const Industry = sequelize.define("industrys", {
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: STRING,
  },
  name: {
    type: STRING,
    allowNull: false,
  },
  description: {
    type: STRING,
  },
});

module.exports = Industry;
