const { DOUBLE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const VehicleCategory = require("./motor/VehicleCategory");
const User = require("./acl/user");

const CoverRate = sequelize.define("cover_rates", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  coverType: {
    type: STRING,
    allowNull: false,
  },
  rate: {
    type: DOUBLE,
    defaultValue: 0,
  },
  included_in: {
    type: INTEGER,
  },
  prerequisites: {
    type: INTEGER,
  },
  constant: {
    type: DOUBLE,
    defaultValue: 0.0,
  },
  flag: {
    type: STRING
  },
  description: {
    type: STRING,
    allowNull: false,
  },
  userId: {
    type: INTEGER,
  },
});
CoverRate.belongsTo(CoverRate, {
  foreignKey: "included_in",
  as: "includedIn",
});
CoverRate.belongsTo(CoverRate, {
  foreignKey: "prerequisites",
  as: "prerequisite",
});
CoverRate.belongsTo(User, { foreignKey: 'userId', as: 'user' })

module.exports = CoverRate;
