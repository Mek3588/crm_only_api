const { STRING, DOUBLE } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const BranchPhones = require("./BranchPhone");
const Employee = require("./Employee");
const PhoneNo = require("./PhoneNo");
const User = require("./acl/user");


const Setting = sequelize.define("settings", {
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: STRING,
    allowNull: false,
  },
  code: {
    type: STRING,
  },
  rate: {
    type: DOUBLE,
  },
  isPercentage: {
    type: BOOLEAN,
    defaultValue: false,
  },
  isForTP: {
    type: BOOLEAN,
    defaultValue: false,
  },
  description: {
    type: STRING,
  },
  userId: {
    type: INTEGER,
  },
});

Setting.belongsTo(User, { foreignKey: 'userId', as: 'user' })

module.exports = Setting;
