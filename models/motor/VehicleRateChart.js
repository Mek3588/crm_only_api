const { STRING, DOUBLE, DATE } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../../database/connections");
const Vehicle = require("./Vehicle");

const VehicleRateChart = sequelize.define("vehicle_rate_charts", {
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  vehicleType: {
    type: STRING,
    allowNull: false,
  },
  vehicleId: {
    type: INTEGER,
  },
  min_manufactured_year: {
    type: DATE
  },
  max_manufactured_year: {
    type: DATE
  },
  is_named_driver: {
    type: BOOLEAN,
    defaultValue: false,
  },
  purpose: {
    type: STRING,
    allowNull: false,
  },
  rate: {
    type: DOUBLE,
    allowNull: false,
  },
});

VehicleRateChart.belongsTo(Vehicle);
module.exports = VehicleRateChart;
