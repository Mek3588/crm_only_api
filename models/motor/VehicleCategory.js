const { STRING, DOUBLE, BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../../database/connections");

const VehicleCategory = sequelize.define("vehicle_categories", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: STRING,
    allowNull: false,
  },
  superCategotyId: {
    type: INTEGER,
  },
  rate: {
    type: DOUBLE,
  },
  make_of: {
    type: STRING,
  },
  description: {
    type: STRING,
  },
  flag: {
    type: STRING,
  },
  isActive: {
    type: BOOLEAN,
  },
});
VehicleCategory.belongsTo(VehicleCategory, {
  foreignKey: "superCategotyId",
  as: "superCategory",
});
VehicleCategory.hasMany(VehicleCategory, {
  foreignKey: "superCategotyId",
  as: "subCategories"
})
module.exports = VehicleCategory;
