const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");

const GradeLevel = sequelize.define("grade_levels", {
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
  description: {
    type: STRING,
  },
});

module.exports = GradeLevel;
