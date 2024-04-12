const { STRING, DOUBLE } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const BranchPhones = require("./BranchPhone");
const Employee = require("./Employee");
const PhoneNo = require("./PhoneNo");

const TipperMotorSpecialTp = sequelize.define("tipper_motor_special_tps", {
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
  isTrailer: BOOLEAN,
  driverType: STRING,
  initPremium: {
    type: DOUBLE,
  },
});

module.exports = TipperMotorSpecialTp;
