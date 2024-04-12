const { STRING } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const BranchPhones = require("./BranchPhone");
const City = require("./City");
const Employee = require("./Employee");
const PhoneNo = require("./PhoneNo");

const Subcity = sequelize.define("subcitys", {
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  cityId : {
    type: STRING,
    allowNull: false
  },
  name: {
    type: STRING,
    allowNull: false,
  },
  description: {
    type: STRING,
  },
});


Subcity.belongsTo(City);
module.exports = Subcity;
