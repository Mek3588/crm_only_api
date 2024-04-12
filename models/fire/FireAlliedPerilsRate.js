const { STRING } = require("sequelize");
const { DOUBLE } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../../database/connections");

const FireAlliedPerilsRate = sequelize.define("fire_allied_perils_rates", {
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  alliedPerilName: {
    type: STRING,
    allowNull: false,
  },
  flag: {
    type: STRING,
  },
  rate: {
    type: DOUBLE
  },
  userId: {
    type: INTEGER,
  },
  
});

module.exports = FireAlliedPerilsRate;
