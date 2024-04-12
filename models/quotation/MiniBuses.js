const { STRING, INTEGER, BOOLEAN, DOUBLE, DATE } = require("sequelize");
const sequelize = require("../../database/connections");
const Vehicle = require("../motor/Vehicle");

const MiniBus = sequelize.define("mini_buses", {
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  vehicle_id: {
    type: INTEGER,
    allowNull: false,
  },
  min_manufactured_year: {
    type: DATE,
  },
  max_manufactured_year: {
    type: DATE,
  },
  purpose: {
    type: STRING,
    allowNull: false,
  },
  min_seat: {
    type: INTEGER,
    allowNull: false,
  },
  max_seat: {
    type: INTEGER,
    allowNull: false,
  },
  is_locally_modified_body: {
    type: BOOLEAN,
    allowNull: false,
  },
  rate: {
    type: DOUBLE,
    allowNull: false,
  },
});

MiniBus.belongsTo(Vehicle, {
  foreignKey: "vehicle_id",
  as: "Vehicle",
});
module.exports = MiniBus;
