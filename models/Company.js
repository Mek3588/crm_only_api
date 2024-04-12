const { INTEGER, STRING } = require("sequelize");
const sequelize = require("../database/connections");

const Company = sequelize.define("companies", {
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
  phone: {
    type: STRING,
    allowNull: false,
  },
  email: {
    type: STRING,
    allowNull: false,
  },
  anual_plan: {
    type: STRING,
    allowNull: false,
  },
  actual_production: {
    type: STRING,
    allowNull: false,
  },
  type: {
    type: STRING,
  },
  remark: {
    type: STRING,
  },
});

module.exports = Company;
