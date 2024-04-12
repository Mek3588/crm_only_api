const { DOUBLE, STRING, NUMBER } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
// const Contact = require("./Contact");

const PhoneNo = sequelize.define("phoneNos", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  ownerId: {
    type: INTEGER,
  },
  type: {
    type: STRING,
    allowNull: false,
  },
  phoneNo: {
    type: STRING,
    allowNull: false,
  },
  category: {
    type: STRING,
    allowNull: false,
  },
});

module.exports = PhoneNo;
