const { STRING, DOUBLE } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const BranchPhones = require("./BranchPhone");
const Employee = require("./Employee");
const PhoneNo = require("./PhoneNo");
const User = require("./acl/user");


const TerritorialExtension = sequelize.define("torritorial_extensions", {
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  country: {
    type: STRING,
    allowNull: false,
  },
  rate: {
    type: DOUBLE,
  },
  constant: {
    type: DOUBLE,
  },
  userId: {
    type: INTEGER,
  },
});

TerritorialExtension.belongsTo(User, { foreignKey: 'userId', as: 'user' })

module.exports = TerritorialExtension;