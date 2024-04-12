const { STRING, DOUBLE } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const BranchPhones = require("./BranchPhone");
const Employee = require("./Employee");
const Vehicle = require("./motor/Vehicle");
const PhoneNo = require("./PhoneNo");

const TruckTankerTp = sequelize.define("truck_tanker_tps", {
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
  minCapacity: {
    type: INTEGER,
  },
  maxCapacity: {
    type: INTEGER,
  },
  purpose: {
    type: STRING,
  },
  initPremium: {
    type: DOUBLE,
  },
  is_trailer: {
    type: BOOLEAN
  },
  is_semi_trailer: {
    type: BOOLEAN
  },
  isFixed: {
    type: String
  },
  vehicleId: {
    type: INTEGER
  }
});

TruckTankerTp.belongsTo(Vehicle, { foreignKey: "vehicleId" });

module.exports = TruckTankerTp;
