const { STRING, DOUBLE } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const User = require("./acl/user");

const BSG = sequelize.define("bsgs", {
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  vehicle: {
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

BSG.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

module.exports = BSG;
