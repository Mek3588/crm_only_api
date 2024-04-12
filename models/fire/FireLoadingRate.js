const { STRING, Sequelize } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../../database/connections");

const FireLoadingRate = sequelize.define("fire_loading_rates", {
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
  code: {
    type: STRING,
  },
  rate: {
    type: STRING,
  },
  isDiscount: {
    type: BOOLEAN,
  },
  description: {
    type: STRING,
  },
  userId: {
    type: INTEGER,
  },
  
});
// sequelize.sync({ alter: true });

module.exports = FireLoadingRate;
