const { STRING } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const BranchPhones = require("./BranchPhone");
const Country = require("./Country");
const Employee = require("./Employee");
const PhoneNo = require("./PhoneNo");

const Region = sequelize.define("regions", {
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  countryId: {
    type: INTEGER
  },
  name: {
    type: STRING,
    allowNull: false,
  },
  description: {
    type: STRING,
  },
});

Region.belongsTo(Country);
module.exports = Region;
