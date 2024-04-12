const { STRING, BOOLEAN } = require("sequelize");
const { DOUBLE } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");

const Service = sequelize.define("services", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  serviceName: {
    type: STRING,
    allowNull: false,
  },
  usageUnit: {
    type: STRING,
    allowNull: false,
  },
  website: {
    type: STRING,
    allowNull: false,
  },
  category: {
    type: STRING,
    allowNull: false,
  },
  assignedTo: {
    type: INTEGER,
    allowNull: false,
  },
  sharedWith: {
    type: INTEGER,
  },

  active: {
    type: BOOLEAN,
    allowNull: false,
  },
  renewable: {
    type: BOOLEAN,
    allowNull: false,
  },
  private: {
    type: BOOLEAN,
    allowNull: false,
  },
  price: {
    type: DOUBLE,
    allowNull: false,
  },
  cost: {
    type: DOUBLE,
  },

  taxes: {
    type: DOUBLE,
    allowNull: false,
  },
  description: {
    type: STRING,
    allowNull: false,
  },
});
module.exports = Service;
