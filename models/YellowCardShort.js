const { STRING, DOUBLE } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const BranchPhones = require("./BranchPhone");
const Employee = require("./Employee");
const PhoneNo = require("./PhoneNo");
const User = require("./acl/user");

const YellowCardShort = sequelize.define("yellowCardShorts", {
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  period: {
    type: STRING,
    allowNull: false,
  },
  rate: {
    type: DOUBLE,
  },
  userId: {
    type: INTEGER,
  },
});

YellowCardShort.belongsTo(User, { foreignKey: 'userId', as: 'user' })

module.exports = YellowCardShort;
