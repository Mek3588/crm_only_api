const { STRING, DOUBLE, DATE } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../../database/connections");

const MotBajAmb = sequelize.define("mot_baj_ambs", {
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  vehicle_type: {
    type: STRING,
  },
  min_manufactured_year: {
    type: DATE,
  },
  max_manufactured_year: {
    type: DATE,
  },
  purpose: {
    type: STRING,
  },
  rate: {
    type: DOUBLE,
  },
});
// sequelize.sync({ alter: true });

module.exports = MotBajAmb;
