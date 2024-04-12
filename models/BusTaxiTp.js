const { STRING, DOUBLE } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const BranchPhones = require("./BranchPhone");
const Employee = require("./Employee");
const PhoneNo = require("./PhoneNo");

const BusTaxiTp = sequelize.define("bus_taxi_tps", {
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
  minSeat: {
    type: INTEGER,
  },
  maxSeat: {
    type: INTEGER,
  },
  purpose: {
    type: STRING,
  },
  initPremium: {
    type: DOUBLE,
  },
  taxi_type: {
    type: STRING,
  },
});

module.exports = BusTaxiTp;
