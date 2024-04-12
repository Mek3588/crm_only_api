const { STRING, DOUBLE, DATE } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const BranchPhones = require("./BranchPhone");
const Employee = require("./Employee");
const PhoneNo = require("./PhoneNo");
const Vehicle = require("./motor/Vehicle");

const RideAndTaxi = sequelize.define("rides_and_taxes", {
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
    allowNull: false,
  },
  min_manufactured_year: {
    type: DATE,
  },
  max_manufactured_year: {
    type: DATE,
  },
  rate: {
    type: DOUBLE,
  },
});
RideAndTaxi.belongsTo(Vehicle);
module.exports = RideAndTaxi;
