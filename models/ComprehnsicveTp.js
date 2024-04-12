const { STRING, DOUBLE, DATE } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const User = require("./acl/user");

const ComprehensiveTp = sequelize.define("comprehnsiveTps", {
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  vehicleType: {
    type: STRING,
  },
  purpose: {
    type: STRING,
  },
  amount: {
    type: DOUBLE,
  },
  isRate: {
    type: BOOLEAN,
  },
  userId: {
    type: INTEGER,
  },

});

ComprehensiveTp.belongsTo(User, { foreignKey: 'userId', as: 'user' })
module.exports = ComprehensiveTp;
