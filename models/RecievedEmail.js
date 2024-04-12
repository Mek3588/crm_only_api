const { STRING, INTEGER, TEXT, DATE } = require("sequelize");
const sequelize = require("../database/connections");
const User = require("./acl/user");
const Document = require("./Document");
const EmailDocument = require("./EmailDocument");
const RecievedEmail = sequelize.define("recieved_emails", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  subject: {
    type: STRING,
  },
  from: {
    type: STRING,
    allowNull: false,
  },
  to: {
    type: STRING,
  },
  cc: {
    type: STRING,
  },
  message: {
    type: TEXT("long"),
    allowNull: false,
  },
  recievedDate: {
    type: DATE
  },
});

module.exports = RecievedEmail;
