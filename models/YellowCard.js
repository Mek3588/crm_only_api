const { STRING, DOUBLE } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const BranchPhones = require("./BranchPhone");
const Employee = require("./Employee");
const PhoneNo = require("./PhoneNo");
const User = require("./acl/user");

const YellowCard = sequelize.define("yellowCards", {
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  vehicle_type: {
    type: STRING,
    allowNull: false,
  },
  amount: {
    type: DOUBLE,
  },
  userId: {
    type: INTEGER,
  },
});

YellowCard.belongsTo(User, { foreignKey: 'userId', as: 'user' })

module.exports = YellowCard;
