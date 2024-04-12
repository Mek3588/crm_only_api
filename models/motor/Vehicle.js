const { STRING } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../../database/connections");
const User = require("../acl/user");
const VehicleCategory = require("./VehicleCategory");



const Vehicle = sequelize.define("vehicles", {
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: STRING,
    allowNull: false,
  },
  make_of: {
    type: STRING,
  },
  vehicle_type: {
    type: STRING,
  },
  description: {
    type: STRING,
  },
  category: {
    type: STRING,
    defaultValue: "Normal"
  },
  userId: {
    type: INTEGER,
  },

});
// sequelize.sync({ alter: true });
Vehicle.belongsTo(User)
//Vehicle.belongsTo(VehicleCategory, {as: 'vehiclecategory'})

module.exports = Vehicle;
