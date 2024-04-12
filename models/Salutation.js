const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");

const Salutation = sequelize.define("salutations", {
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

module.exports = Salutation;