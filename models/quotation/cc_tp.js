const { STRING, INTEGER, BOOLEAN, DOUBLE } = require("sequelize");
const sequelize = require("../../database/connections");
const Vehicle = require("../motor/Vehicle");

const CCTP = sequelize.define("cc_tps", {
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
  min_cc: {
    type: INTEGER,
    allowNull: false,
  },
  max_cc: {
    type: INTEGER,
    allowNull: false,
  },
  is_named_driver: {
    defaultValue: false,
    type: BOOLEAN,
  },
  purpose: {
    type: STRING,
    allowNull: false,
  },
  initPremium: {
    type: INTEGER,
    allowNull: false,
  },
});

module.exports = CCTP;
